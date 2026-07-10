import api from './api';

/**
 * Add a new user skill.
 * @param {Object} data - { name, type, category, experience, description }
 */
export const addUserSkill = async (data) => {
  const response = await api.post('/user-skills', data);
  return response.data;
};

/**
 * Update an existing user skill.
 * @param {number|string} id - User skill ID.
 * @param {Object} data - { name, category, experience, description }
 */
export const updateUserSkill = async (id, data) => {
  const response = await api.put(`/user-skills/${id}`, data);
  return response.data;
};

/**
 * Delete a user skill from profile.
 * @param {number|string} id - User skill ID.
 */
export const deleteUserSkill = async (id) => {
  const response = await api.delete(`/user-skills/${id}`);
  return response.data;
};
