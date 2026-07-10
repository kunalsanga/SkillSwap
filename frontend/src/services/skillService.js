import api from './api';

// --- Global Skill APIs (Teammate's implementation) ---

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

// --- User Profile Skill APIs (Our implementation) ---

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
