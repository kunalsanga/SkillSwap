const swapService = require('../services/swap.service');
const { ApiResponse } = require('../utils/apiResponse');
const { validateId } = require('../validators/validator');

/**
 * POST /api/swap-request
 * Create a new swap request.
 */
const createSwap = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const swap = await swapService.createSwapRequest(senderId, req.body);
    res.status(201).json(new ApiResponse(201, swap, 'Swap request created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/swap-request
 * List swap requests involving the authenticated user.
 */
const listSwaps = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await swapService.listSwapRequests(userId, req.query);
    res.status(200).json(new ApiResponse(200, results, 'Swap requests retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/swap-request/:id/accept
 * Accept a swap request (Receiver only).
 */
const acceptSwap = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'swapRequestId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap request ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    const userId = req.user.id;
    const swap = await swapService.acceptSwapRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, swap, 'Swap request accepted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/swap-request/:id/reject
 * Reject a swap request (Receiver only).
 */
const rejectSwap = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'swapRequestId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap request ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    const userId = req.user.id;
    const swap = await swapService.rejectSwapRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, swap, 'Swap request rejected successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/swap-request/:id/cancel
 * Cancel a swap request (Sender only).
 */
const cancelSwap = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'swapRequestId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap request ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    const userId = req.user.id;
    const swap = await swapService.cancelSwapRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, swap, 'Swap request cancelled successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/swap-request/:id/complete
 * Complete a swap request (Participant only).
 */
const completeSwap = async (req, res, next) => {
  try {
    const { error, value: swapId } = validateId(req.params.id, 'swapRequestId');
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid swap request ID format',
        data: null,
        errors: [{ field: 'id', message: error }]
      });
    }

    const userId = req.user.id;
    const swap = await swapService.completeSwapRequest(swapId, userId);
    res.status(200).json(new ApiResponse(200, swap, 'Swap request completed successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSwap,
  listSwaps,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  completeSwap,
};
