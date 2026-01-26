// routes/user.js
const express = require("express");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Joi = require('joi');
const prisma = require('../lib/prisma');

const router = express.Router();

const updateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  password: Joi.string().min(8).optional()
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json(user);
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    res.status(500).json({ error: "Erro ao carregar perfil" });
  }
});

router.put("/profile", auth, async (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, password } = req.body;
  const data = {};

  if (name) data.name = name;
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Nada para atualizar" });
  }

  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;