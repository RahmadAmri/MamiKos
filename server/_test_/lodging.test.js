const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { generatePassword } = require("../helpers/bcrypt");
const { sequelize, User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { queryInterface } = sequelize;

let access_token_staff;
let access_token_admin;

beforeAll(async () => {
  // seeding user
  const users = require("../user.json").map((element) => {
    delete element.id;
    element.createdAt = new Date();
    element.updatedAt = new Date();
    element.password = generatePassword(element.password);
    return element;
  });

  await queryInterface.bulkInsert("Users", users);
  // seeding type
  const type = require("../type.json").map((element) => {
    delete element.id;
    element.createdAt = new Date();
    element.updatedAt = new Date();
    return element;
  });

  await queryInterface.bulkInsert("Types", type);
  // seeding lodgings
  const lodging = require("../lodging.json").map((element) => {
    delete element.id;
    element.createdAt = new Date();
    element.updatedAt = new Date();
    return element;
  });
  await queryInterface.bulkInsert("Lodgings", lodging);

  const staff = await User.findOne({ where: { role: "Staff" } });
  access_token_staff = generateToken({ id: staff.id });
  const admin = await User.findOne({ where: { role: "Admin" } });
  access_token_admin = generateToken({ id: admin.id });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Lodgings", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("Types", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET /pub", function () {
  it("should return array of pub", async function () {
    const response = await request(app)
      .get("/pub")
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body.data[0]).toHaveProperty("name", expect.any(String));
  });
});

describe("POST /lodging (Create)", function () {
  it("should succeed in creating a lodging (201)", async function () {
    const lodging = {
      name: "Kos Rukita",
      facility: "AC, WiFi, Laundry",
      roomCapacity: 10,
      imgUrl:
        "https://cdn.antaranews.com/cache/1200x800/2020/04/24/mamikos.jpg",
      location: "Jakarta Selatan",
      price: 120000,
      TypeId: 1,
      AuthorId: 1,
    };
    const response = await request(app)
      .post("/lodging")
      .set("Authorization", `Bearer ${access_token_staff}`)
      .send(lodging);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name", lodging.name);
  });

  it("should fail if not logged in (401)", async function () {
    const lodging = {
      name: "Kos Rukita",
      facility: "AC, WiFi, Laundry",
      roomCapacity: 10,
      imgUrl:
        "https://cdn.antaranews.com/cache/1200x800/2020/04/24/mamikos.jpg",
      location: "Jakarta Selatan",
      price: 120000,
      TypeId: 1,
      AuthorId: 1,
    };
    const response = await request(app).post("/lodging").send(lodging);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if token is invalid (401)", async function () {
    const lodging = {
      name: "Kos Rukita",
      facility: "AC, WiFi, Laundry",
      roomCapacity: 10,
      imgUrl:
        "https://cdn.antaranews.com/cache/1200x800/2020/04/24/mamikos.jpg",
      location: "Jakarta Selatan",
      price: 120000,
      TypeId: 1,
      AuthorId: 1,
    };
    const response = await request(app)
      .post("/lodging")
      .set("Authorization", "Bearer invalidtoken")
      .send(lodging);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if request body is invalid (400)", async function () {
    const lodging = {
      // name is missing
      facility: "AC, WiFi, Laundry",
      roomCapacity: 10,
      imgUrl:
        "https://cdn.antaranews.com/cache/1200x800/2020/04/24/mamikos.jpg",
      location: "Jakarta Selatan",
      price: 120000,
      TypeId: 1,
      AuthorId: 1,
    };
    const response = await request(app)
      .post("/lodging")
      .set("Authorization", `Bearer ${access_token_staff}`)
      .send(lodging);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("POST /login", function () {
  it("test success login", async function () {
    const response = await request(app).post("/login").send({
      email: "alipahlevi@gmail.com",
      password: "namaakuali",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
  it("test email empty", async function () {
    const response = await request(app).post("/login").send({
      // email: "alipahlevi@gmail.com",
      password: "namasayaali",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  it("test password empty ", async function () {
    const response = await request(app).post("/login").send({
      email: "alipahlevi@gmail.com",
      // password: "namasayaali",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  it("test password incorrect", async function () {
    const response = await request(app).post("/login").send({
      email: "alipahlevi@gmail.com",
      password: "abdulkeren",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "errorPassword");
  });
});

describe("PUT /lodging/:id", function () {
  it("should succeed in updating a lodging (200)", async function () {
    const updatedLodging = {
      name: "Kos Updated",
      facility: "AC, WiFi, Laundry, Kitchen",
      roomCapacity: 12,
      imgUrl: "https://example.com/updated-image.jpg",
      location: "Jakarta Utara",
      price: 150000,
      TypeId: 1,
    };
    const response = await request(app)
      .put("/lodging/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send(updatedLodging);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("name", updatedLodging.name);
  });

  it("should fail if not logged in (401)", async function () {
    const response = await request(app)
      .put("/lodging/1")
      .send({ name: "Test" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if token is invalid (401)", async function () {
    const response = await request(app)
      .put("/lodging/1")
      .set("Authorization", "Bearer invalidtoken")
      .send({ name: "Test" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if entity not found (404)", async function () {
    const response = await request(app)
      .put("/lodging/999")
      .set("Authorization", `Bearer ${access_token_staff}`)
      .send({ name: "Test" });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Lodging not found");
  });

  it("should fail if Staff tries to update non-owned entity (403)", async function () {
    const response = await request(app)
      .put("/lodging/1")
      .set("Authorization", `Bearer ${access_token_staff}`)
      .send({ name: "Test" });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Forbidden");
  });

  it("should fail if request body is invalid (400)", async function () {
    const response = await request(app)
      .put("/lodging/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({ name: "" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("GET /pub/lodging", () => {
  it("Successfully get the main entity without using query filter parameters", async function () {
    const response = await request(app).get("/pub?filter[types]=");
    expect(response.status).toBe(200);
  });

  it("Successfully get the main entity by using parameter filter query", async function () {
    const response = await request(app).get("/pub?filter[types]=1");
    expect(response.status).toBe(200);
  });

  it("Successfully get the main entity with pagination", async function () {
    const response = await request(app).get("/pub?page[size]=5&page[number]=1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data.length).toBeLessThanOrEqual(5);
    expect(response.body).toHaveProperty("pagination");
  });

  it("Successfully get a single lodging by id", async function () {
    const response = await request(app).get("/pub/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("id", 1);
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("location");
  });

  it("Failed to get lodging - Invalid ID", async function () {
    const response = await request(app).get("/pub/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Lodging not found");
  });
});

describe("DELETE /lodging/:id", function () {
  it("should succeed in deleting a lodging (200)", async function () {
    const response = await request(app)
      .delete("/lodging/1")
      .set("Authorization", `Bearer ${access_token_admin}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Lodging deleted successfully"
    );
  });

  it("should fail if not logged in (401)", async function () {
    const response = await request(app).delete("/lodging/1");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if token is invalid (401)", async function () {
    const response = await request(app)
      .delete("/lodging/1")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should fail if entity not found (404)", async function () {
    const response = await request(app)
      .delete("/lodging/999")
      .set("Authorization", `Bearer ${access_token_staff}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Lodging not found");
  });

  it("should fail if Staff tries to delete non-owned entity (403)", async function () {
    const response = await request(app)
      .delete("/lodging/3")
      .set("Authorization", `Bearer ${access_token_staff}`);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "Forbidden");
  });
});
