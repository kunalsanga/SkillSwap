const prisma = require('../config/db');

/**
 * Custom error helper with status codes.
 */
const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Create a new swap request.
 * @param {number} senderId Authenticated user ID.
 * @param {Object} data Request body data.
 * @param {number} data.receiverId Receiver user ID.
 * @param {number} data.offeredSkillId Skill sender offers.
 * @param {number} data.wantedSkillId Skill sender wants.
 * @param {string} [data.message] Optional message.
 */
const createSwapRequest = async (senderId, data) => {
  const { receiverId, offeredSkillId, wantedSkillId, message } = data;

  if (senderId === receiverId) {
    throw createError('You cannot send a swap request to yourself.', 400);
  }

  // Verify receiver exists and is not banned
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiver) {
    throw createError('Receiver user not found.', 404);
  }
  if (receiver.isBanned) {
    throw createError('Cannot request a swap with a banned user.', 400);
  }

  // Verify skills exist
  const offeredSkill = await prisma.skill.findUnique({ where: { id: offeredSkillId } });
  const wantedSkill = await prisma.skill.findUnique({ where: { id: wantedSkillId } });

  if (!offeredSkill || !wantedSkill) {
    throw createError('Offered or wanted skill not found.', 404);
  }

  // Verify the sender actually has the offered skill
  const senderHasSkill = await prisma.userSkill.findFirst({
    where: { userId: senderId, skillId: offeredSkillId, type: 'OFFERED' }
  });
  if (!senderHasSkill) {
    throw createError('You do not offer this skill.', 400);
  }

  // Verify the receiver actually offers the wanted skill
  const receiverHasSkill = await prisma.userSkill.findFirst({
    where: { userId: receiverId, skillId: wantedSkillId, type: 'OFFERED' }
  });
  if (!receiverHasSkill) {
    throw createError('The receiver does not offer your wanted skill.', 400);
  }

  // Prevent duplicate pending requests
  const existingPending = await prisma.swapRequest.findFirst({
    where: {
      senderId,
      receiverId,
      offeredSkillId,
      wantedSkillId,
      status: 'PENDING',
    },
  });

  if (existingPending) {
    throw createError('A pending swap request for these skills already exists between you and this user.', 400);
  }

  // Create the swap request
  return prisma.swapRequest.create({
    data: {
      senderId,
      receiverId,
      offeredSkillId,
      wantedSkillId,
      message,
      status: 'PENDING',
    },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * List swap requests involving the authenticated user.
 * @param {number} userId Authenticated user ID.
 * @param {Object} options Filtering options.
 * @param {string} [options.type] 'sent' or 'received'.
 * @param {string} [options.status] Filter by SwapStatus.
 * @param {number} [options.page=1] Page number.
 * @param {number} [options.limit=10] Limit.
 */
const listSwapRequests = async (userId, options = {}) => {
  const page = Math.max(1, parseInt(options.page, 10) || 1);
  const limit = Math.max(1, parseInt(options.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const where = {};

  // Filter by sender vs receiver
  if (options.type === 'sent') {
    where.senderId = userId;
  } else if (options.type === 'received') {
    where.receiverId = userId;
  } else {
    // Both
    where.OR = [
      { senderId: userId },
      { receiverId: userId },
    ];
  }

  // Filter by status
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
 * Accept a swap request (Receiver only).
 */
const acceptSwapRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw createError('Swap request not found.', 404);
  }

  if (swap.receiverId !== userId) {
    throw createError('Only the receiver can accept this swap request.', 403);
  }

  if (swap.status !== 'PENDING') {
    throw createError(`Cannot accept swap request with status ${swap.status}. Status must be PENDING.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'ACCEPTED' },
    include: { offeredSkill: true, wantedSkill: true },
  });
};

/**
 * Reject a swap request (Receiver only).
 */
const rejectSwapRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw createError('Swap request not found.', 404);
  }

  if (swap.receiverId !== userId) {
    throw createError('Only the receiver can reject this swap request.', 403);
  }

  if (swap.status !== 'PENDING') {
    throw createError(`Cannot reject swap request with status ${swap.status}. Status must be PENDING.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'REJECTED' },
    include: { offeredSkill: true, wantedSkill: true },
  });
};

/**
 * Cancel a swap request (Sender only).
 */
const cancelSwapRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw createError('Swap request not found.', 404);
  }

  if (swap.senderId !== userId) {
    throw createError('Only the sender can cancel this swap request.', 403);
  }

  if (swap.status !== 'PENDING' && swap.status !== 'ACCEPTED') {
    throw createError(`Cannot cancel swap request with status ${swap.status}. Status must be PENDING or ACCEPTED.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'CANCELLED' },
    include: { offeredSkill: true, wantedSkill: true },
  });
};

/**
 * Complete a swap request (Either participant).
 */
const completeSwapRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw createError('Swap request not found.', 404);
  }

  if (swap.senderId !== userId && swap.receiverId !== userId) {
    throw createError('Only swap participants can complete this swap request.', 403);
  }

  if (swap.status !== 'ACCEPTED') {
    throw createError(`Cannot complete swap request with status ${swap.status}. Status must be ACCEPTED.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'COMPLETED' },
    include: { offeredSkill: true, wantedSkill: true },
  });
};

module.exports = {
  createSwapRequest,
  listSwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  completeSwapRequest,
};
