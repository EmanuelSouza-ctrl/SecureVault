const express = require("express");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Joi = require('joi');
const db = require("../database/db");
const router = express.Router();

const updateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  password: Joi.string().min(8).optional()
});

router.get("/profile", auth, (req, res) => {
  db.get("SELECT id, name, email FROM users WHERE id=?", [req.user.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Perfil não encontrado" });
    res.json(row);
  });
});

router.put("/profile", auth, async (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, password } = req.body;
  let query = "UPDATE users SET ";
  let params = [];
  if (name) {
    query += "name = ?, ";
    params.push(name);
  }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    query += "password = ?, ";
    params.push(hash);
  }
  if (params.length === 0) return res.status(400).json({ error: "Nada para atualizar" });
  query = query.slice(0, -2) + " WHERE id = ?";
  params.push(req.user.id);

  db.run(query, params, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar perfil" });
    res.json({ success: true });
  });
});

module.exports = router;