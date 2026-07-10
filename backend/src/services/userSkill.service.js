const prisma = require('../config/db');
const { AppError } = require('../utils/appError');

/**
 * Add a new skill to the authenticated user's profile.
 * @param {number} userId - The user ID.
 * @param {Object} data - Payload containing name, type, category, experience, description.
 */
const addUserSkill = async (userId, data) => {
  const { name, type, category, experience, description } = data;
  const skillName = name.trim();

  // Run in a transaction to guarantee integrity
  return prisma.$transaction(async (tx) => {
    // 1. Find or create global skill
    let skill = await tx.skill.findFirst({
      where: { name: { equals: skillName, mode: 'insensitive' } },
    });

    if (!skill) {
      skill = await tx.skill.create({
        data: { name: skillName },
      });
    }

    // 2. Check if user already added this skill
    const existing = await tx.userSkill.findFirst({
      where: {
        userId,
        skillId: skill.id,
        type,
      },
    });

    if (existing) {
      throw new AppError(`You have already added "${skillName}" to your skills ${type.toLowerCase()}.`, 400);
    }

    // 3. Link user and skill
    return tx.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
        type,
        category: category || null,
        experience: experience || null,
        description: description || null,
      },
      include: {
        skill: true,
      },
    });
  });
};

/**
 * Update an existing user skill.
 * @param {number} userSkillId - User skill ID.
 * @param {number} userId - Authenticated user ID (owner).
 * @param {Object} data - Payload containing name, category, experience, description.
 */
const updateUserSkill = async (userSkillId, userId, data) => {
  const { name, category, experience, description } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Find user skill and check ownership
    const userSkill = await tx.userSkill.findUnique({
      where: { id: userSkillId },
      include: { skill: true },
    });

    if (!userSkill) {
      throw new AppError('User skill not found.', 404);
    }

    if (userSkill.userId !== userId) {
      throw new AppError('You are not authorized to edit this skill.', 403);
    }

    const updatePayload = {
      category: category !== undefined ? category : userSkill.category,
      experience: experience !== undefined ? experience : userSkill.experience,
      description: description !== undefined ? description : userSkill.description,
    };

    // 2. If name changed, map to a new or existing global skill ID and check duplicates
    if (name && name.trim().toLowerCase() !== userSkill.skill.name.toLowerCase()) {
      const skillName = name.trim();
      let newSkill = await tx.skill.findFirst({
        where: { name: { equals: skillName, mode: 'insensitive' } },
      });

      if (!newSkill) {
        newSkill = await tx.skill.create({
          data: { name: skillName },
        });
      }

      // Check if updating would create a duplicate
      const duplicate = await tx.userSkill.findFirst({
        where: {
          userId,
          skillId: newSkill.id,
          type: userSkill.type,
          NOT: { id: userSkillId },
        },
      });

      if (duplicate) {
        throw new AppError(`You already have a skill for "${skillName}" in your profile.`, 400);
      }

      updatePayload.skillId = newSkill.id;
    }

    return tx.userSkill.update({
      where: { id: userSkillId },
      data: updatePayload,
      include: {
        skill: true,
      },
    });
  });
};

/**
 * Remove a skill link from a user's profile.
 * @param {number} userSkillId - User skill ID.
 * @param {number} userId - Authenticated user ID (owner).
 */
const deleteUserSkill = async (userSkillId, userId) => {
  const userSkill = await prisma.userSkill.findUnique({
    where: { id: userSkillId },
  });

  if (!userSkill) {
    throw new AppError('User skill not found.', 404);
  }

  if (userSkill.userId !== userId) {
    throw new AppError('You are not authorized to delete this skill.', 403);
  }

  return prisma.userSkill.delete({
    where: { id: userSkillId },
  });
};

module.exports = {
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
};
