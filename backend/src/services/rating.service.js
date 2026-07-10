const prisma = require('../config/db');

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Submit feedback/rating for a completed swap.
 * @param {number} giverId Authenticated user giving the rating.
 * @param {Object} data Rating data.
 * @param {number} data.swapRequestId Swap request ID.
 * @param {number} data.rating Rating value (1-5).
 * @param {string} [data.feedback] Feedback message.
 */
const submitFeedback = async (giverId, data) => {
  const { swapRequestId, rating, feedback } = data;

  const ratingVal = parseInt(rating, 10);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    throw createError('Rating must be an integer between 1 and 5.', 400);
  }

  // Fetch the swap request
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapRequestId },
  });

  if (!swap) {
    throw createError('Swap request not found.', 404);
  }

  // Validate swap status
  if (swap.status !== 'COMPLETED') {
    throw createError('You can only rate after a swap request has been COMPLETED.', 400);
  }

  // Validate participant
  const isSender = swap.senderId === giverId;
  const isReceiver = swap.receiverId === giverId;

  if (!isSender && !isReceiver) {
    throw createError('You are not a participant in this swap request.', 403);
  }

  // Determine receiver of the rating
  const receiverId = isSender ? swap.receiverId : swap.senderId;

  // Validate only one rating per user per swap
  const existingRating = await prisma.rating.findUnique({
    where: {
      swapRequestId_giverId: {
        swapRequestId,
        giverId,
      },
    },
  });

  if (existingRating) {
    throw createError('You have already submitted feedback for this swap request.', 400);
  }

  // Create the rating
  return prisma.rating.create({
    data: {
      swapRequestId,
      giverId,
      receiverId,
      rating: ratingVal,
      feedback,
    },
    include: {
      giver: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
      swapRequest: true,
    },
  });
};

/**
 * Retrieve ratings received by a specific user.
 * @param {number} userId Target user ID.
 * @param {Object} options Pagination options.
 * @param {number} [options.page=1] Page number.
 * @param {number} [options.limit=10] Limit.
 */
const getUserFeedback = async (userId, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  // Confirm target user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw createError('User not found.', 404);
  }

  const where = { receiverId: userId };

  const total = await prisma.rating.count({ where });

  const ratings = await prisma.rating.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      giver: { select: { id: true, name: true, email: true } },
      swapRequest: {
        include: {
          offeredSkill: true,
          wantedSkill: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(total / limit);

  // Calculate average rating
  const agg = await prisma.rating.aggregate({
    where,
    _avg: {
      rating: true,
    },
  });

  return {
    ratings,
    averageRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(2)) : 0,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

module.exports = {
  submitFeedback,
  getUserFeedback,
};
