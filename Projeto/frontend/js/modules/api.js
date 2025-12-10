// js/api.js
const API_URL = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');
export async function apiFetch(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (getToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Erro na API');
  return data;
}
export const register = (data) => apiFetch('/register', { method: 'POST', body: JSON.stringify(data) });
export const login = (credentials) => apiFetch('/login', { method: 'POST', body: JSON.stringify(credentials) });
export const getMe = () => apiFetch('/me');
export const getFiles = () => apiFetch('/files');
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch('/upload', {
    method: 'POST',
    body: formData,
    headers: {} 
  });
};
export const deleteFile = (id) => apiFetch(`/files/${id}`, { method: 'DELETE' });