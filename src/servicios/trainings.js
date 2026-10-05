import api from './api';

// GET /api/trainings → lista pública
export async function listTrainings() {
  const { data } = await api.get('/api/trainings');
  return data;
}

// GET /api/trainings/:id → detalle
export async function getTraining(id) {
  const { data } = await api.get(`/api/trainings/${id}`);
  return data;
}

// POST /api/trainings/:id/view → registrar vista
export async function registerView(id, viewerToken) {
  const { data } = await api.post(`/api/trainings/${id}/view`, {
    viewer_token: viewerToken,
  });
  return data;
}

// POST /api/trainings → crear (admin, multipart)
export async function createTraining({ title, description, file_type, file }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description || '');
  formData.append('file_type', file_type);
  formData.append('file', file);

  const { data } = await api.post('/api/trainings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// PUT /api/trainings/:id → editar (admin)
export async function updateTraining(id, { title, description }) {
  const { data } = await api.put(`/api/trainings/${id}`, { title, description });
  return data;
}

// DELETE /api/trainings/:id → eliminar (admin)
export async function deleteTraining(id) {
  const { data } = await api.delete(`/api/trainings/${id}`);
  return data;
}