const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/send-code", userController.sendCode);
router.post("/verify-code", userController.verifyCode);

module.exports = router;
