const prisma = require('../config/db');
const { AppError } = require('../utils/appError');

/**
 * Get all incoming swap requests for a user.
 * @param {number} userId - The authenticated user ID (receiver).
 */
const getIncomingRequests = async (userId) => {
  return prisma.swapRequest.findMany({
    where: { receiverId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          bio: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Get all outgoing swap requests for a user.
 * @param {number} userId - The authenticated user ID (sender).
 */
const getOutgoingRequests = async (userId) => {
  return prisma.swapRequest.findMany({
    where: { senderId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          bio: true,
        },
      },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Send a swap request.
 * @param {number} senderId - Sender user ID.
 * @param {Object} data - Payload containing receiverId, offeredSkillId, wantedSkillId, message.
 */
const sendRequest = async (senderId, data) => {
  const { receiverId, offeredSkillId, wantedSkillId, message } = data;

  if (senderId === receiverId) {
    throw new AppError('You cannot send a swap request to yourself.', 400);
  }

  // Verify receiver exists and is not banned
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiver) {
    throw new AppError('Receiver user not found.', 404);
  }
  if (receiver.isBanned) {
    throw new AppError('Cannot request a swap with a banned user.', 400);
  }

  // Verify skills exist
  const offeredSkill = await prisma.skill.findUnique({ where: { id: offeredSkillId } });
  const wantedSkill = await prisma.skill.findUnique({ where: { id: wantedSkillId } });

  if (!offeredSkill || !wantedSkill) {
    throw new AppError('Offered or wanted skill not found.', 404);
  }

  // Verify the sender offers the offered skill
  const senderHasSkill = await prisma.userSkill.findFirst({
    where: { userId: senderId, skillId: offeredSkillId, type: 'OFFERED' },
  });
  if (!senderHasSkill) {
    throw new AppError('You do not offer this skill.', 400);
  }

  // Verify the receiver offers the wanted skill
  const receiverHasSkill = await prisma.userSkill.findFirst({
    where: { userId: receiverId, skillId: wantedSkillId, type: 'OFFERED' },
  });
  if (!receiverHasSkill) {
    throw new AppError('The receiver does not offer your wanted skill.', 400);
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
    throw new AppError('A pending swap request for these skills already exists between you and this user.', 400);
  }

  // Create swap request
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
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Accept a swap request. Only receiver can accept, and only if PENDING.
 * @param {number} swapId - Swap request ID.
 * @param {number} userId - Authenticated user ID.
 */
const acceptRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw new AppError('Swap request not found.', 404);
  }

  if (swap.receiverId !== userId) {
    throw new AppError('Only the receiver can accept this swap request.', 403);
  }

  if (swap.status !== 'PENDING') {
    throw new AppError(`Cannot accept swap request with status ${swap.status}. Status must be PENDING.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'ACCEPTED' },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePhoto: true } },
      receiver: { select: { id: true, name: true, email: true, profilePhoto: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Reject a swap request. Only receiver can reject, and only if PENDING.
 * @param {number} swapId - Swap request ID.
 * @param {number} userId - Authenticated user ID.
 */
const rejectRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw new AppError('Swap request not found.', 404);
  }

  if (swap.receiverId !== userId) {
    throw new AppError('Only the receiver can reject this swap request.', 403);
  }

  if (swap.status !== 'PENDING') {
    throw new AppError(`Cannot reject swap request with status ${swap.status}. Status must be PENDING.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'REJECTED' },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePhoto: true } },
      receiver: { select: { id: true, name: true, email: true, profilePhoto: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Cancel a swap request. Only sender can cancel, and only if PENDING.
 * @param {number} swapId - Swap request ID.
 * @param {number} userId - Authenticated user ID.
 */
const cancelRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw new AppError('Swap request not found.', 404);
  }

  if (swap.senderId !== userId) {
    throw new AppError('Only the sender can cancel this swap request.', 403);
  }

  if (swap.status !== 'PENDING') {
    throw new AppError(`Cannot cancel swap request with status ${swap.status}. Status must be PENDING.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'CANCELLED' },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePhoto: true } },
      receiver: { select: { id: true, name: true, email: true, profilePhoto: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

/**
 * Complete a swap request. Either participant can complete, and only if ACCEPTED.
 * @param {number} swapId - Swap request ID.
 * @param {number} userId - Authenticated user ID.
 */
const completeRequest = async (swapId, userId) => {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
  });

  if (!swap) {
    throw new AppError('Swap request not found.', 404);
  }

  if (swap.senderId !== userId && swap.receiverId !== userId) {
    throw new AppError('Only swap participants can complete this swap request.', 403);
  }

  if (swap.status !== 'ACCEPTED') {
    throw new AppError(`Cannot complete swap request with status ${swap.status}. Status must be ACCEPTED.`, 400);
  }

  return prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: 'COMPLETED' },
    include: {
      sender: { select: { id: true, name: true, email: true, profilePhoto: true } },
      receiver: { select: { id: true, name: true, email: true, profilePhoto: true } },
      offeredSkill: true,
      wantedSkill: true,
    },
  });
};

module.exports = {
  getIncomingRequests,
  getOutgoingRequests,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
};
