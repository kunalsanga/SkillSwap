const { ApiResponse } = require('../utils/apiResponse');

const login = async (req, res, next) => {
  try {
    // TODO: Implement login logic
    res.status(200).json(new ApiResponse(200, { token: 'sample_token' }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    // TODO: Implement register logic
    res.status(201).json(new ApiResponse(201, null, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
