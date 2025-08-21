const express = require("express");
const router = express.Router();
const sessionController = require("../Controller/session.controller");

router.get("/user/:userId", sessionController.getUserSessions);
router.get("/user/:userId/stats", sessionController.getUserSessionStats);

module.exports = router;