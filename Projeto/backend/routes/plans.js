const express = require("express");
const auth = require("../middleware/auth");
const db = require("../database/db");
const router = express.Router();

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM plans", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao listar planos" });
    res.json(rows);
  });
});

module.exports = router;