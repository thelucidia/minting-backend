const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/send-code", userController.sendCode);
router.post("/verify-code", userController.verifyCode);
router.post("/check-following", userController.checkFollowingTwitter);
router.post("/check-username-telegram", userController.checkMembershipForTelegram);
router.post("/check-username-discord", userController.checkMembershipForDiscord);

module.exports = router;
