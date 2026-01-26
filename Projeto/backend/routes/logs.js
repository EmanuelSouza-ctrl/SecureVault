const express = require("express");
const auth = require("../middleware/auth");
const db = require("../database/db");
const router = express.Router();

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM logs WHERE user_id = ? ORDER BY created_at DESC", [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar logs" });
    res.json(rows);
  });
});

// Exemplo: Para adicionar log, chame de outros controllers, ex: após upload
// db.run("INSERT INTO logs (user_id, message) VALUES (?,?)", [userId, "Arquivo uploaded"]);

module.exports = router;