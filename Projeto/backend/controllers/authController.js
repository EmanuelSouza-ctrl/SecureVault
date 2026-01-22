const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Joi = require('joi');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const resetSchema = Joi.object({
  email: Joi.string().email().required()
});

const confirmSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
});

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [name, email, hash], function(err) {
      if (err) return res.status(400).json({ error: "Email já existe" });
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar" });
  }
};

exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};

exports.resetRequest = async (req, res) => {
  const { error } = resetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email } = req.body;
  db.get("SELECT id FROM users WHERE email=?", [email], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "Email não encontrado" });
    const token = jwt.sign({ id: user.id, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    transporter.sendMail({
      to: email,
      subject: 'Reset Senha SecureVault',
      text: `Seu token de reset: ${token}. Expira em 15 minutos.`
    }).then(() => res.json({ success: true }))
      .catch(() => res.status(500).json({ error: "Erro ao enviar email" }));
  });
};

exports.resetConfirm = async (req, res) => {
  const { error } = confirmSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'reset') throw new Error("Token inválido");
    const hash = await bcrypt.hash(password, 10);
    db.run("UPDATE users SET password=? WHERE id=?", [hash, decoded.id], (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  } catch (err) {
    res.status(400).json({ error: "Token inválido ou expirado" });
  }
};