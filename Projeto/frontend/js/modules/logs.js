import { getLogs } from "./api.js";
import { notify } from "./notifications.js";

export async function loadLogs() {
  const list = document.getElementById("logs");
  if (!list) return;

  list.innerHTML = '<div class="loading">Carregando logs...</div>';

  try {
    const logs = await getLogs();
    list.innerHTML = "";

    if (!logs.length) {
      list.innerHTML = "<li>Nenhuma ação registrada.</li>";
      return;
    }

    logs.forEach(log => {
      const li = document.createElement("li");

      const date = log.created_at
        ? new Date(log.created_at).toLocaleString()
        : "Data desconhecida";

      li.textContent = `[${date}] ${log.message}`;
      list.appendChild(li);
    });
  } catch (error) {
    notify("Erro ao carregar logs", "error");
    list.innerHTML = "";
  }
}
