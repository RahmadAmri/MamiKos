require("dotenv").config();
const express = require("express");
const lodging = express.Router();
const Controller = require("../controllers/controller");
const guardStaff = require("../middlewares/guardStaff");

lodging.post("/", Controller.postAddLodging);

lodging.put("/:id", guardStaff, Controller.editLodging);
lodging.delete("/:id", guardStaff, Controller.deleteLodging);

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});
lodging.patch("/:id", upload.single("imgUrl"), Controller.cloudinary);

module.exports = lodging;
