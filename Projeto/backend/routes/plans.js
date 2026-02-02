// routes/plans.js
const express = require("express");
const auth = require("../middleware/auth");
const prisma = require("../lib/prisma");  // ← importe o Prisma aqui

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      select: {
        id: true,
        name: true,
        storage_gb: true,
        price_monthly: true,
      },
      orderBy: { id: 'asc' },  // ou por price_monthly se preferir
    });

    res.json(plans);
  } catch (err) {
    console.error("Erro ao listar planos:", err);
    res.status(500).json({ error: "Erro ao listar planos" });
  }
});

module.exports = router;