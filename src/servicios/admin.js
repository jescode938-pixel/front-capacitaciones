import api from './api';

export async function getStats({ from, to } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const { data } = await api.get('/api/admin/stats', { params });
  return data;
}