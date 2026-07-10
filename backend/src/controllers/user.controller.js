const userService = require('../services/user.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');

/**
 * GET /api/users
 * Search/list public profiles.
 */
const searchPublicUsers = async (req, res, next) => {
  try {
    const results = await userService.searchUsers(req.query, false);
    res.status(200).json(new ApiResponse(200, results, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Retrieve a single user profile.
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { error, value: userId } = validateId(req.params.id, 'userId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, 'User profile not found'));
    }

    res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchPublicUsers,
  getUserProfile,
};
