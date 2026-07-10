import api from './api';

export const getSkills = async (params = {}) => {
  const response = await api.get('/skills', { params });
  return response.data;
};

export const createSkill = async (name) => {
  const response = await api.post('/skills', { name });
  return response.data;
};

export const updateSkill = async (id, name) => {
  const response = await api.put(`/skills/${id}`, { name });
  return response.data;
};
