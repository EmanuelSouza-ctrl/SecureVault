import { getLogs } from "./api.js";
import { notify } from "./notifications.js";

export async function loadLogs() {
  const list = document.getElementById("logs");
  if (!list) return;

  list.innerHTML = '<div class="loading">Carregando logs...</div>';

  try {
    const logs = await getLogs();
    list.innerHTML = "";
    logs.forEach(log => {
      const li = document.createElement("li");
      li.textContent = `[${log.created_at}] ${log.message}`;
      list.appendChild(li);
    });
  } catch (error) {
    notify("Erro ao carregar logs", "error");
    list.innerHTML = "";
  }
}