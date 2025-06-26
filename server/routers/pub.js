require("dotenv").config();

const express = require("express");
const pub = express.Router();
const Controller = require("../controllers/controller");

pub.get("/", Controller.getPublicLodging);
pub.get("/:id", Controller.getPublicLodgingById);

module.exports = pub;
