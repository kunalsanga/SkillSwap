const skillService = require('../services/skill.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');

/**
 * GET /api/skills
 * List all skills.
 */
const getSkills = async (req, res, next) => {
  try {
    const skills = await skillService.getAllSkills(req.query.search);
    res.status(200).json(new ApiResponse(200, skills, 'Skills retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/skills
 * Create a new skill (Admin only).
 */
const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }
    const skill = await skillService.createSkill(name.trim());
    res.status(201).json(new ApiResponse(201, skill, 'Skill created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/skills/:id
 * Update an existing skill (Admin only).
 */
const updateSkill = async (req, res, next) => {
  try {
    const { error, value: skillId } = validateId(req.params.id, 'skillId');
    if (error) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const skill = await skillService.updateSkill(skillId, name.trim());
    res.status(200).json(new ApiResponse(200, skill, 'Skill updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/skills/:id
 * Delete a skill (Admin only).
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { error, value: skillId } = validateId(req.params.id, 'skillId');
    if (error) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    await skillService.deleteSkill(skillId);
    res.status(200).json(new ApiResponse(200, null, 'Skill deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
