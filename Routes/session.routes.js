const express = require("express");
const {auth} = require("../middleware/user.auth")
const router = express.Router();
const sessionController = require("../Controller/session.controller");


router.get("/user/:userId", sessionController.getUserSessions);
router.get("/user/:userId/stats", sessionController.getUserSessionStats);

router.post("/", auth, sessionController.startsession)
router.patch("/:id/end", auth, sessionController.endSession);
router.delete("/:id", auth, sessionController.deleteSession);

module.exports = router;