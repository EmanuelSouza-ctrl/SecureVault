require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require('express-rate-limit');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/files");
const planRoutes = require("./routes/plans");
const logRoutes = require("./routes/logs");

require("./database/init");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Muitas tentativas, tente novamente mais tarde"
});
app.use("/auth", authLimiter);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/files", fileRoutes);
app.use("/plans", planRoutes);
app.use("/logs", logRoutes);

// No final do server.js (antes do app.listen)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    console.log('Usuários encontrados:', users);
  } catch (err) {
    console.error('Erro ao testar Prisma:', err);
  }
})();

app.listen(3000, () => {
  console.log("Backend rodando em http://localhost:3000");
});
