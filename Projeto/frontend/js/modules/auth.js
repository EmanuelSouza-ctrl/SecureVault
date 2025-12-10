// js/auth.js
import { login } from './api.js';

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export async function doLogin(email, password) {
  const data = await login({ email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'entrar.html';
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}