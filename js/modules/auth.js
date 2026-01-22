import { login as apiLogin } from './api.js';
import { notify } from './notifications.js';

export async function loginUser(email, password) {
  try {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    notify("Login bem-sucedido!", "success");
    window.location.href = "dashboard.html";
  } catch (err) {
    notify(err.message, "error");
  }
}

export function logout() {
  localStorage.removeItem("token");
  notify("Logout realizado", "info");
  window.location.href = "entrar.html";
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}