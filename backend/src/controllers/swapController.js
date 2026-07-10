const swapService = require('../services/swapService');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');
const { AppError } = require('../utils/appError');

/**
 * GET /swaps/incoming
 * Retrieve incoming swap requests for the authenticated user.
 */
const getIncoming = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await swapService.getIncomingRequests(userId);
    res.status(200).json(new ApiResponse(200, data, 'Incoming swap requests retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /swaps/outgoing
 * Retrieve outgoing swap requests sent by the authenticated user.
 */
const getOutgoing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await swapService.getOutgoingRequests(userId);
    res.status(200).json(new ApiResponse(200, data, 'Outgoing swap requests retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /swaps/request
 * Send a new swap request.
 */
const sendRequest = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const data = await swapService.sendRequest(senderId, req.body);
    res.status(201).json(new ApiResponse(201, data, 'Swap request sent successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /swaps/:id/accept
 * Accept a swap request (Receiver only).
 */
const accept = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    const data = await swapService.acceptRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, data, 'Swap request accepted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /swaps/:id/reject
 * Reject a swap request (Receiver only).
 */
const reject = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    const data = await swapService.rejectRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, data, 'Swap request rejected successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /swaps/:id/cancel
 * Cancel a swap request (Sender only).
 */
const cancel = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    const data = await swapService.cancelRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, data, 'Swap request cancelled successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /swaps/:id/complete
 * Complete a swap request (Sender/Receiver participant).
 */
const complete = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'id');
    if (error) {
      return next(new AppError(error, 400));
    }
    const userId = req.user.id;
    const data = await swapService.completeRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, data, 'Swap request completed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncoming,
  getOutgoing,
  sendRequest,
  accept,
  reject,
  cancel,
  complete,
};
