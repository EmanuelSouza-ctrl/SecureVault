const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const controller = require("../controllers/fileController");
const fs = require('fs').promises;

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

// Nova rota DELETE
router.delete("/:id", auth, async (req, res) => {
  const fileId = req.params.id;

  db.get(
    "SELECT path, filename FROM files WHERE id = ? AND user_id = ?",
    [fileId, req.user.id],
    async (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao consultar arquivo" });
      if (!row) return res.status(404).json({ error: "Arquivo não encontrado ou não pertence ao usuário" });

      try {
        // Tenta deletar o arquivo físico (ignora se não existir)
        await fs.unlink(row.path).catch(() => {});

        // Deleta do banco
        db.run("DELETE FROM files WHERE id = ?", [fileId], (err) => {
          if (err) return res.status(500).json({ error: "Erro ao deletar do banco" });

          // Log da ação (opcional, mas recomendado)
          db.run(
            "INSERT INTO logs (user_id, message, created_at) VALUES (?, ?, datetime('now'))",
            [req.user.id, `Arquivo deletado: ${row.filename || 'ID ' + fileId}`]
          );

          res.json({ success: true, message: "Arquivo excluído com sucesso" });
        });
      } catch (err) {
        console.error("Erro ao deletar arquivo físico:", err);
        res.status(500).json({ error: "Erro ao deletar arquivo" });
      }
    }
  );
});

module.exports = router;