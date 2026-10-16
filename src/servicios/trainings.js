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
export async function createTraining({ title, description, file_type, youtube_id }) {
  const { data } = await api.post('/api/trainings', {
    title,
    description,
    file_type,
    youtube_id,
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

export async function getTrainingsVersion() {
  const { data } = await api.get('/api/trainings/version');
  return data; // { total, ultima }
}