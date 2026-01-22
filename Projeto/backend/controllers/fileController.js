const db = require("../database/db");

exports.upload = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Nenhum arquivo enviado" });
  db.run(
    "INSERT INTO files (user_id, filename, path, created_at) VALUES (?,?,?, datetime('now'))",
    [req.user.id, file.originalname, file.path],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao salvar arquivo" });
      res.json({ success: true, file: { filename: file.originalname } });
    }
  );
};

exports.list = (req, res) => {
  db.all(
    "SELECT * FROM files WHERE user_id = ?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar arquivos" });
      res.json(rows);
    }
  );
};