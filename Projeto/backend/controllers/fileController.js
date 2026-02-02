const prisma = require("../lib/prisma");
const fs = require("fs").promises;
const path = require("path");

exports.upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  try {
    const newFile = await prisma.file.create({
      data: {
        userId: req.user.id,
        filename: req.file.originalname,
        path: req.file.path,
      },
    });

    res.json({ success: true, file: newFile });
  } catch (err) {
    console.error("Erro upload:", err);
    res.status(500).json({ error: "Erro ao salvar arquivo" });
  }
};

exports.list = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar arquivos" });
  }
};

exports.deleteFile = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const file = await prisma.file.findUnique({ where: { id } });

    if (!file || file.userId !== req.user.id) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    await fs.unlink(path.resolve(file.path)).catch(() => {});
    await prisma.file.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("Erro delete:", err);
    res.status(500).json({ error: "Erro ao excluir arquivo" });
  }
};

exports.download = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const file = await prisma.file.findUnique({ where: { id } });

    if (!file || file.userId !== req.user.id) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (err) {
    res.status(500).json({ error: "Erro ao baixar arquivo" });
  }
};
