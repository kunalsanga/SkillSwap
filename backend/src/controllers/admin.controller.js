const adminService = require('../services/admin.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');

/**
 * GET /api/admin/users
 * List all users in the system (including banned/private).
 */
const getUsers = async (req, res, next) => {
  try {
    const results = await adminService.listAllUsers(req.query);
    res.status(200).json(new ApiResponse(200, results, 'All users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/ban/:id
 * Ban or unban a user.
 */
const banUser = async (req, res, next) => {
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

    const { isBanned, reason } = req.body;
    if (isBanned === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Field isBanned (boolean) is required.',
        data: null,
        errors: [{ field: 'isBanned', message: 'isBanned is required.' }]
      });
    }

    const user = await adminService.setBanStatus(userId, !!isBanned, reason);
    const msg = isBanned ? 'User banned successfully' : 'User unbanned successfully';
    res.status(200).json(new ApiResponse(200, user, msg));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/swaps
 * List all swaps in the system.
 */
const getSwaps = async (req, res, next) => {
  try {
    const results = await adminService.listAllSwaps(req.query);
    res.status(200).json(new ApiResponse(200, results, 'All swaps retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/announcement
 * Broadcast system announcement.
 */
const postAnnouncement = async (req, res, next) => {
  try {
    const { title, message } = req.body;
    const ann = await adminService.createAnnouncement(title, message);
    res.status(201).json(new ApiResponse(201, ann, 'Announcement created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/skill/:id
 * Delete skill from platform.
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { error, value: skillId } = validateId(req.params.id, 'skillId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    await adminService.deleteSkill(skillId);
    res.status(200).json(new ApiResponse(200, null, 'Skill deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  banUser,
  getSwaps,
  postAnnouncement,
  deleteSkill,
};
