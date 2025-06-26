require("dotenv").config();

const express = require("express");
const type = express.Router();
const Controller = require("../controllers/controller");

type.put("/", Controller.postAddTypes);
type.get("/", Controller.getTypes);
type.put("/:id", Controller.editTypes);
type.delete("/:id", Controller.deleteTypes);

module.exports = type;
