const express = require("express");
const multer = require("multer");

const router = express.Router();

const { analyzeImage } = require("../Controllers/AIController");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/analyze-image", upload.single("image"), analyzeImage);

module.exports = router;