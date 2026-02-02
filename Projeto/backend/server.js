require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/files");
const planRoutes = require("./routes/plans");

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

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Backend rodando em http://localhost:${PORT}`);
});
