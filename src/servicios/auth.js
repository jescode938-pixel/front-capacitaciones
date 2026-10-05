import api from './api';

export async function login(username, password) {
  const { data } = await api.post('/api/auth/login', { username, password });
  // Guarda el token y los datos del admin
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function getAdminUser() {
  const raw = localStorage.getItem('admin_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('admin_token'));
}