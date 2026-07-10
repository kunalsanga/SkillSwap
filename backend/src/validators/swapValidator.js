const { z } = require('zod');

const createSwapSchema = z.object({
  receiverId: z.number({ required_error: 'Receiver ID is required.' }).int().positive('Receiver ID must be a positive integer.'),
  offeredSkillId: z.number({ required_error: 'Offered Skill ID is required.' }).int().positive('Offered Skill ID must be a positive integer.'),
  wantedSkillId: z.number({ required_error: 'Wanted Skill ID is required.' }).int().positive('Wanted Skill ID must be a positive integer.'),
  message: z.string().trim().max(500, 'Message cannot exceed 500 characters.').optional().nullable(),
});

module.exports = {
  createSwapSchema,
};
