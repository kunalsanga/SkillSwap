const prisma = require('../config/db');

/**
 * Search and list users with filters, pagination, and sorting.
 * @param {Object} options Query parameters.
 * @param {string} [options.skill] Skill name to filter.
 * @param {string} [options.location] Location to filter.
 * @param {string} [options.availability] Availability to filter.
 * @param {string} [options.public] Public status ('true' or 'false').
 * @param {number} [options.page=1] Page number.
 * @param {number} [options.limit=10] Limit of users per page.
 * @param {string} [options.sortBy='name'] Field to sort by.
 * @param {string} [options.sortOrder='asc'] Sort order.
 * @param {boolean} [isAdmin=false] If true, includes private/banned users.
 */
const searchUsers = async (options = {}, isAdmin = false) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'name';
  const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';

  // Construct query where clause
  const where = {};

  // For regular users, only show public, unbanned users
  if (!isAdmin) {
    where.isPublic = true;
    where.isBanned = false;
  } else {
    // For admin, allow filtering by public status if provided
    if (options.public !== undefined) {
      where.isPublic = options.public === 'true';
    }
  }

  // Location filter (case-insensitive partial match)
  if (options.location) {
    where.location = {
      contains: options.location,
      mode: 'insensitive',
    };
  }

  // Availability filter (case-insensitive partial match)
  if (options.availability) {
    where.availability = {
      contains: options.availability,
      mode: 'insensitive',
    };
  }

  // Skill filter (matches if user offers this skill)
  if (options.skill) {
    where.skills = {
      some: {
        type: 'OFFERED',
        skill: {
          name: {
            equals: options.skill,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  // Count total records matching criteria
  const total = await prisma.user.count({ where });

  // Fetch users with skills mapped
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
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
 * Get user profile by ID.
 * @param {number} userId User ID.
 * @returns {Promise<Object|null>} User profile details.
 */
const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
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
};

module.exports = {
  searchUsers,
  getUserById,
};
