const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const controller = require("../controllers/fileController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Tipo de arquivo não permitido'));
  }
});

const router = express.Router();

router.get("/", auth, controller.list);
router.post("/upload", auth, upload.single("file"), controller.upload);

module.exports = router;