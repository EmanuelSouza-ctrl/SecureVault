const db = require("../database/db");

function logAction(userId, message) {
  db.run(
    "INSERT INTO logs (user_id, message, created_at) VALUES (?, ?, datetime('now'))",
    [userId, message],
    (err) => {
      if (err) {
        console.error("Falha ao registrar log:", err.message);
      }
    }
  );
}

module.exports = { logAction };