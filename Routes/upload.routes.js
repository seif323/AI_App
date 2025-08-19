const express = require("express");
const router = express.Router();
const uploadController = require("../Controller/upload.controller");

const multer = require("multer");
const upload = multer({ dest: "assets/images/" });

// POST /api/upload
router.post("/", upload.single("image"), uploadController.uploadData);
module.exports = router;
