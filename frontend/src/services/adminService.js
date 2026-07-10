import api from './api';

export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const banUser = async (id, reason) => {
  const response = await api.patch(`/admin/ban/${id}`, { reason });
  return response.data;
};

export const getSwaps = async (params = {}) => {
  const response = await api.get('/admin/swaps', { params });
  return response.data;
};

export const postAnnouncement = async (data) => {
  const response = await api.post('/admin/announcement', data);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/admin/skill/${id}`);
  return response.data;
};
