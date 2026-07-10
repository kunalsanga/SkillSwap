import api from './api';

export const createSwap = async (data) => {
  const response = await api.post('/swap-request', data);
  return response.data;
};

export const listSwaps = async (params = {}) => {
  const response = await api.get('/swap-request', { params });
  return response.data;
};

export const acceptSwap = async (id) => {
  const response = await api.patch(`/swap-request/${id}/accept`);
  return response.data;
};

export const rejectSwap = async (id) => {
  const response = await api.patch(`/swap-request/${id}/reject`);
  return response.data;
};

export const cancelSwap = async (id) => {
  const response = await api.patch(`/swap-request/${id}/cancel`);
  return response.data;
};

export const completeSwap = async (id) => {
  const response = await api.patch(`/swap-request/${id}/complete`);
  return response.data;
};
