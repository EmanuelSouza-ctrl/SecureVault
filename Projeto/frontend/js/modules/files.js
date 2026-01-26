import { listFiles, uploadFile, apiRequest } from "./api.js";
import { notify } from "./notifications.js";

export async function loadFiles() {
  const list = document.getElementById("files");
  if (!list) return;

  list.innerHTML = '<div class="loading">Carregando arquivos...</div>';

  try {
    const files = await listFiles();
    list.innerHTML = "";
    files.forEach(file => {
      const li = document.createElement("li");
      li.textContent = `${file.filename} (${file.created_at})`;

      const btn = document.createElement("button");
      btn.textContent = "Excluir";
      btn.addEventListener("click", () => deleteFile(file.id));
      li.appendChild(btn);

      list.appendChild(li);
    });
  } catch (error) {
    notify("Erro ao carregar arquivos", "error");
    list.innerHTML = "";
  }
}

async function deleteFile(id) {
  if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

  try {
    await apiRequest(`/files/${id}`, {
      method: "DELETE"
    });
    notify("Arquivo excluído com sucesso", "success");
    loadFiles(); // recarrega a lista automaticamente
  } catch (error) {
    notify("Erro ao excluir arquivo: " + (error.message || "Tente novamente"), "error");
  }
}

export async function handleUpload() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) return notify("Selecione um arquivo", "warning");

  try {
    await uploadFile(file);
    notify("Upload concluído!", "success");
    loadFiles();
    fileInput.value = '';
  } catch (error) {
    notify("Falha no upload: " + error.message, "error");
  }
}