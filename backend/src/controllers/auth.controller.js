const authService = require('../services/auth.service');
const { ApiResponse } = require('../utils/apiResponse');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(200).json(new ApiResponse(200, user, 'Authenticated user retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

const logout = async (_req, res, next) => {
  try {
    const result = await authService.logout();
    res.status(200).json(new ApiResponse(200, result, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, me, updateProfile, logout };
