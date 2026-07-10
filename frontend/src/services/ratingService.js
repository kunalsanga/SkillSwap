import api from './api';

export const createFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

export const getUserFeedback = async (userId) => {
  const response = await api.get(`/feedback/${userId}`);
  return response.data;
};
