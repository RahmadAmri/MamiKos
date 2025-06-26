require("dotenv").config();

const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/auth");
const AuthController = require("../controllers/authController");
const guardAdmin = require("../middlewares/guardAdmin");

router.use("/lodging", authentication, require("./lodging"));
router.use("/type", require("./type"));
router.post("/login", AuthController.login);
router.use("/register", authentication, guardAdmin, require("./registration"));
router.use("/pub", require("./pub"));

module.exports = router;
