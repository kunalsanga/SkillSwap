import api from './api';

export const searchUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserProfile = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
