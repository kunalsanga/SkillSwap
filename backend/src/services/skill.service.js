const prisma = require('../config/db');
const { AppError } = require('../utils/appError');

/**
 * Get all skills, optionally filtered by name.
 * @param {string} [search] Optional search query.
 */
const getAllSkills = async (search) => {
  const where = {};
  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  return prisma.skill.findMany({
    where,
    orderBy: { name: 'asc' },
  });
};

/**
 * Create a new skill globally.
 * @param {string} name Skill name.
 */
const createSkill = async (name) => {
  const existingSkill = await prisma.skill.findUnique({
    where: { name },
  });

  if (existingSkill) {
    throw new AppError('Skill already exists', 409, [{ field: 'name', message: 'Skill already exists' }]);
  }

  return prisma.skill.create({
    data: { name },
  });
};

/**
 * Update an existing skill.
 * @param {number} id Skill ID.
 * @param {string} name New skill name.
 */
const updateSkill = async (id, name) => {
  const skill = await prisma.skill.findUnique({ where: { id } });
  
  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  const existingSkill = await prisma.skill.findUnique({
    where: { name },
  });

  if (existingSkill && existingSkill.id !== id) {
    throw new AppError('Skill with this name already exists', 409, [{ field: 'name', message: 'Skill name already in use' }]);
  }

  return prisma.skill.update({
    where: { id },
    data: { name },
  });
};

/**
 * Delete a skill.
 * @param {number} id Skill ID.
 */
const deleteSkill = async (id) => {
  const skill = await prisma.skill.findUnique({ where: { id } });
  
  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  return prisma.skill.delete({
    where: { id },
  });
};

module.exports = {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
