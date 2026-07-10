const prisma = require('../config/db');

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * List all users in the system (Admin only, includes banned/private).
 */
const listAllUsers = async (options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'name';
  const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';

  const where = {};

  if (options.location) {
    where.location = { contains: options.location, mode: 'insensitive' };
  }

  if (options.isBanned !== undefined) {
    where.isBanned = options.isBanned === 'true';
  }

  if (options.role) {
    where.role = options.role;
  }

  const total = await prisma.user.count({ where });

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      location: true,
      profilePhoto: true,
      availability: true,
      isPublic: true,
      isBanned: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      skills: {
        select: {
          id: true,
          type: true,
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * Ban or unban a user.
 * @param {number} userId ID of user to ban/unban.
 * @param {boolean} isBanned Target ban status.
 * @param {string} [reason] Optional reason for banning.
 */
const setBanStatus = async (userId, isBanned, reason) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw createError('User not found.', 404);
  }

  if (user.role === 'ADMIN') {
    throw createError('Admin users cannot be banned.', 400);
  }

  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { isBanned },
    });

    if (isBanned) {
      await tx.banHistory.create({
        data: {
          userId,
          reason: reason || 'No reason provided by admin.',
        },
      });
    }

    return updatedUser;
  });
};

/**
 * List all swaps in the system (Admin only).
 */
const listAllSwaps = async (options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const where = {};
  if (options.status) {
    where.status = options.status;
  }

  const total = await prisma.swapRequest.count({ where });

  const swaps = await prisma.swapRequest.findMany({
    where,
    skip,
    take: limit,
    orderBy: { updatedAt: 'desc' },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    swaps,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * Create announcement (Admin only).
 */
const createAnnouncement = async (title, message) => {
  return prisma.announcement.create({
    data: {
      title,
      message,
    },
  });
};

/**
 * Delete skill (Admin only).
 */
const deleteSkill = async (skillId) => {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    throw createError('Skill not found.', 404);
  }

  return prisma.skill.delete({
    where: { id: skillId },
  });
};

module.exports = {
  listAllUsers,
  setBanStatus,
  listAllSwaps,
  createAnnouncement,
  deleteSkill,
};
