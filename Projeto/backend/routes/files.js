const express = require("express");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fileController = require("../controllers/fileController");

const router = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/upload", auth, upload.single("file"), fileController.upload);
router.get("/", auth, fileController.list);
router.get("/:id/download", auth, fileController.download);
router.delete("/:id", auth, fileController.deleteFile); // 👈 AQUI ESTAVA O ERRO

module.exports = router;