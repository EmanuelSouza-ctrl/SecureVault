const prisma = require('../lib/prisma');

exports.upload = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  try {
    const newFile = await prisma.file.create({
      data: {
        userId: req.user.id,
        filename: file.originalname,
        path: file.path,
      },
    });

    await prisma.log.create({
      data: {
        userId: req.user.id,
        message: `Upload de arquivo: ${file.originalname} (ID: ${newFile.id})`,
      },
    });

    res.json({
      success: true,
      file: {
        id: newFile.id,
        filename: file.originalname,
        createdAt: newFile.createdAt,
      },
    });
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ error: 'Erro ao salvar arquivo' });
  }
};

exports.list = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        filename: true,
        path: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(files);
  } catch (err) {
    console.error('Erro ao listar arquivos:', err);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
};