import { getProfile, updateProfile } from "./api.js";
import { notify } from "./notifications.js";

export async function loadProfile() {
  try {
    const user = await getProfile();
    document.getElementById("name")?.value = user.name;
    document.getElementById("email")?.value = user.email;
    document.getElementById("user-name").textContent = `Olá, ${user.name}`;
  } catch (error) {
    notify("Erro ao carregar perfil", "error");
  }
}

export async function saveProfile() {
  const name = document.getElementById("name")?.value;
  const password = document.getElementById("password")?.value;

  const data = {};
  if (name) data.name = name;
  if (password) data.password = password;

  if (Object.keys(data).length === 0) return notify("Nada para atualizar", "warning");

  try {
    await updateProfile(data);
    notify("Perfil atualizado com sucesso!", "success");
    loadProfile();
  } catch (error) {
    notify("Erro ao atualizar perfil: " + error.message, "error");
  }
}