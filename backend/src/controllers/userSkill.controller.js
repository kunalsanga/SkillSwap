const userSkillService = require('../services/userSkill.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');
const { AppError } = require('../utils/appError');

/**
 * POST /api/user-skills
 * Add a skill to the authenticated user's profile.
 */
const createSkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userSkillService.addUserSkill(userId, req.body);
    res.status(201).json(new ApiResponse(201, data, 'Skill added to profile successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user-skills/:id
 * Update user skill details (ownership enforced).
 */
const updateSkill = async (req, res, next) => {
  try {
    const { error, value: userSkillId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    const data = await userSkillService.updateUserSkill(userSkillId, userId, req.body);
    res.status(200).json(new ApiResponse(200, data, 'Skill updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/user-skills/:id
 * Delete a user skill link (ownership enforced).
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { error, value: userSkillId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    await userSkillService.deleteUserSkill(userSkillId, userId);
    res.status(200).json(new ApiResponse(200, null, 'Skill deleted from profile successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkill,
  updateSkill,
  deleteSkill,
};
