import axios from 'axios';

// Detecta el host desde el que se abrió la página:
// - En la PC: "localhost"
// - En el celular: "192.168.0.105"
// Así las peticiones al backend siempre van al host correcto.
const HOST = window.location.hostname;
const API_URL = `https://back-capacitaciones.vercel.app`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 