const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'securevault-jwt-super-secreto-2025';

// Pastas
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_DIR = path.join(__dirname, 'db');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

// Middleware global
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Banco de dados JSON
const USERS_FILE = path.join(DB_DIR, 'users.json');
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
const writeUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Middleware JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Configuração do multer (só define pasta e nome do arquivo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const userId = req.user.id; // agora req.user JÁ existe porque authenticate rodou antes!
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// ======================== ROTAS DA API ========================

// Registro
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'E-mail já existe' });

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    plano: 'Básico',
    storageUsed: 0,
    files: []
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: { id: newUser.id, name, email, plano: newUser.plano }
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, plano: user.plano }
  });
});

// Dados do usuário
app.get('/api/me', authenticate, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plano: user.plano,
      storageUsed: user.storageUsed
    }
  });
});

// UPLOAD CORRIGIDO – Forma 1 (primeiro autentica, depois faz upload)
app.post('/api/upload', authenticate, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);

    const limiteGB = user.plano === 'Pro' ? 50 : user.plano === 'Empresarial' ? 9999 : 5;
    const limiteBytes = limiteGB * 1024 ** 3;

    if (user.storageUsed + req.file.size > limiteBytes) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Limite de armazenamento excedido' });
    }

    const fileInfo = {
      id: Date.now().toString(),
      name: req.file.originalname,
      size: req.file.size,
      filename: req.file.filename,
      uploadedAt: new Date().toISOString()
    };

    user.files.push(fileInfo);
    user.storageUsed += req.file.size;
    writeUsers(users);

    res.json({ message: 'Upload concluído com sucesso!', file: fileInfo });
  });
});

// Listar arquivos
app.get('/api/files', authenticate, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  res.json(user.files || []);
});

// Download
app.get('/api/download/:filename', authenticate, (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Arquivo não encontrado' });
  }
});

// Excluir arquivo
app.delete('/api/files/:id', authenticate, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  const fileIndex = user.files.findIndex(f => f.id === req.params.id);

  if (fileIndex === -1) return res.status(404).json({ error: 'Arquivo não encontrado' });

  const file = user.files[fileIndex];
  const filePath = path.join(UPLOADS_DIR, file.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  user.storageUsed -= file.size;
  user.files.splice(fileIndex, 1);
  writeUsers(users);

  res.json({ message: 'Arquivo excluído com sucesso' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\nSecureVault API rodando em http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`   POST   /api/register`);
  console.log(`   POST   /api/login`);
  console.log(`   POST   /api/upload (com token)`);
  console.log(`   GET    /api/files (com token)\n`);
});