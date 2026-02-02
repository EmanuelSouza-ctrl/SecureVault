const express = require("express");
const controller = require("../controllers/authController");
const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/reset-request", controller.resetRequest);
router.post("/reset-confirm", controller.resetConfirm);

module.exports = router;