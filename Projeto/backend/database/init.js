const db = require("./db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    path TEXT,
    created_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    storage_gb INTEGER,
    price_monthly REAL
  )`);

  // Dados mock para plans
  db.run("INSERT OR IGNORE INTO plans (name, storage_gb, price_monthly) VALUES ('Básico', 5, 29)");
  db.run("INSERT OR IGNORE INTO plans (name, storage_gb, price_monthly) VALUES ('Pro', 50, 69)");
  db.run("INSERT OR IGNORE INTO plans (name, storage_gb, price_monthly) VALUES ('Enterprise', 0, 149)");
});