const ratingService = require('../services/rating.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');

/**
 * POST /api/feedback
 * Submit feedback/rating for a completed swap.
 */
const createFeedback = async (req, res, next) => {
  try {
    const giverId = req.user.id;
    const rating = await ratingService.submitFeedback(giverId, req.body);
    res.status(201).json(new ApiResponse(201, rating, 'Feedback submitted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/feedback/:userId
 * Retrieve all feedback received by a user.
 */
const getUserFeedback = async (req, res, next) => {
  try {
    const { error, value: userId } = validateId(req.params.userId, 'userId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        data: null,
        errors: [{ field: 'userId', message: error }]
      });
    }

    const results = await ratingService.getUserFeedback(userId, req.query);
    res.status(200).json(new ApiResponse(200, results, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getUserFeedback,
};
