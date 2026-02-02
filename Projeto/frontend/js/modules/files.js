import { listFiles, uploadFile, apiRequest, API_BASE_URL } from "./api.js";
import { notify } from "./notifications.js";

const ENCRYPTION_KEY = "cde64147ea5a4a704f9fc0e4771af1e6d65f4189908eeb03721755d1164df67b";

//  Listar arquivos
export async function loadFiles() {
  const list = document.getElementById("files");
  if (!list) return;

  list.innerHTML = "Carregando arquivos...";

  try {
    const files = await listFiles();
    list.innerHTML = "";

    files.forEach(file => {
      const li = document.createElement("li");
      li.textContent = file.filename;

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Baixar";
      downloadBtn.onclick = () => downloadFile(file.id, file.filename);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Excluir";
      deleteBtn.onclick = () => deleteFile(file.id);

      li.append(" ", downloadBtn, " ", deleteBtn);
      list.appendChild(li);
    });
  } catch (error) {
    notify("Erro ao carregar arquivos", "error");
    list.innerHTML = "";
  }
}

//  Upload criptografado
export async function handleUpload() {
  const input = document.getElementById("fileInput");
  const file = input.files[0];

  if (!file) return notify("Selecione um arquivo", "warning");

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const encrypted = CryptoJS.AES.encrypt(wordArray, ENCRYPTION_KEY);

      const encryptedBytes = new Uint8Array(encrypted.ciphertext.sigBytes);
      for (let i = 0; i < encrypted.ciphertext.sigBytes; i++) {
        encryptedBytes[i] =
          (encrypted.ciphertext.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }

      const blob = new Blob([encryptedBytes], { type: "application/octet-stream" });
      await uploadFile(blob, file.name + ".enc");

      notify("Upload realizado com sucesso!", "success");
      input.value = "";
      loadFiles();
    } catch (error) {
      notify("Erro no upload", "error");
    }
  };

  reader.readAsArrayBuffer(file);
}

//  Download e descriptografia
async function downloadFile(id, filename) {
  try {
    const response = await fetch(`${API_BASE_URL}/files/${id}/download`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) throw new Error("Falha no download");

    const encryptedBuffer = await response.arrayBuffer();
    const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedBuffer);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedWordArray }, ENCRYPTION_KEY);

    const bytes = new Uint8Array(decrypted.sigBytes);
    for (let i = 0; i < decrypted.sigBytes; i++) {
      bytes[i] = (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename.replace(".enc", "");
    a.click();

    URL.revokeObjectURL(url);
    notify("Download concluído!", "success");
  } catch (error) {
    notify("Erro ao baixar arquivo", "error");
  }
}

// Excluir arquivo
async function deleteFile(id) {
  if (!confirm("Deseja excluir este arquivo?")) return;

  try {
    await apiRequest(`/files/${id}`, { method: "DELETE" });
    notify("Arquivo excluído", "success");
    loadFiles();
  } catch (error) {
    notify("Erro ao excluir arquivo", "error");
  }
}