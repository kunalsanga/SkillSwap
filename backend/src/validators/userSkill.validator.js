const { z } = require('zod');

const createUserSkillSchema = z.object({
  name: z
    .string({ required_error: 'Skill name is required.' })
    .trim()
    .min(1, 'Skill name is required.')
    .max(50, 'Skill name must not exceed 50 characters.'),
  type: z.enum(['OFFERED', 'WANTED'], { required_error: 'Skill type must be either OFFERED or WANTED.' }),
  category: z.string().trim().max(100, 'Category must not exceed 100 characters.').optional().nullable(),
  experience: z.string().trim().max(100, 'Experience level must not exceed 100 characters.').optional().nullable(),
  description: z.string().trim().max(500, 'Description must not exceed 500 characters.').optional().nullable(),
});

const updateUserSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Skill name cannot be empty.')
    .max(50, 'Skill name must not exceed 50 characters.')
    .optional(),
  category: z.string().trim().max(100, 'Category must not exceed 100 characters.').optional().nullable(),
  experience: z.string().trim().max(100, 'Experience level must not exceed 100 characters.').optional().nullable(),
  description: z.string().trim().max(500, 'Description must not exceed 500 characters.').optional().nullable(),
});

module.exports = {
  createUserSkillSchema,
  updateUserSkillSchema,
};
