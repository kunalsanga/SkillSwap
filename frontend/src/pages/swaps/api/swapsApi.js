import api from '../../../services/api';

/**
 * Fetch incoming swap requests for the current user.
 */
export const getIncomingRequests = async () => {
  const response = await api.get('/swaps/incoming');
  return response.data;
};

/**
 * Fetch outgoing swap requests sent by the current user.
 */
export const getOutgoingRequests = async () => {
  const response = await api.get('/swaps/outgoing');
  return response.data;
};

/**
 * Send a new swap request.
 * @param {Object} data - receiverId, offeredSkillId, wantedSkillId, message
 */
export const sendRequest = async (data) => {
  const response = await api.post('/swaps/request', data);
  return response.data;
};

/**
 * Accept an incoming swap request.
 * @param {number|string} id - Swap request ID
 */
export const acceptRequest = async (id) => {
  const response = await api.patch(`/swaps/${id}/accept`);
  return response.data;
};

/**
 * Reject an incoming swap request.
 * @param {number|string} id - Swap request ID
 */
export const rejectRequest = async (id) => {
  const response = await api.patch(`/swaps/${id}/reject`);
  return response.data;
};

/**
 * Cancel an outgoing pending swap request.
 * @param {number|string} id - Swap request ID
 */
export const cancelRequest = async (id) => {
  const response = await api.patch(`/swaps/${id}/cancel`);
  return response.data;
};

/**
 * Complete an accepted swap request.
 * @param {number|string} id - Swap request ID
 */
export const completeRequest = async (id) => {
  const response = await api.patch(`/swaps/${id}/complete`);
  return response.data;
};
