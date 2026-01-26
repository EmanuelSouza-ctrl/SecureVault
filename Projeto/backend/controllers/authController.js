// controllers/authController.js
const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Joi = require('joi');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const resetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const confirmSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

exports.register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    await prisma.log.create({
      data: {
        userId: newUser.id,
        message: 'Conta criada com sucesso',
      },
    });

    res.json({ id: newUser.id, message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await prisma.log.create({
      data: {
        userId: user.id,
        message: 'Login realizado com sucesso',
      },
    });

    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

exports.resetRequest = async (req, res) => {
  const { error } = resetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email não encontrado' });
    }

    const token = jwt.sign(
      { id: user.id, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await transporter.sendMail({
      to: email,
      subject: 'Reset Senha SecureVault',
      text: `Seu token de reset: ${token}. Expira em 15 minutos.`,
    });

    await prisma.log.create({
      data: {
        userId: user.id,
        message: 'Solicitação de reset de senha enviada',
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erro no reset request:', err);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
};

exports.resetConfirm = async (req, res) => {
  const { error } = confirmSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hash },
    });

    await prisma.log.create({
      data: {
        userId: decoded.id,
        message: 'Senha redefinida com sucesso',
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Erro no reset confirm:', err);
    res.status(400).json({ error: 'Token inválido ou expirado' });
  }
};