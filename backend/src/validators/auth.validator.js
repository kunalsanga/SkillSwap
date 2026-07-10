const { z } = require('zod');

const normalizeTrimmedString = (schema) =>
  z.preprocess((value) => (typeof value === 'string' ? value.trim() : value), schema);

const emailSchema = normalizeTrimmedString(z.string().email('A valid email is required.').transform((value) => value.toLowerCase()));

const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(128, 'Password must not exceed 128 characters.')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
  .regex(/[0-9]/, 'Password must include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character.');

const skillNameSchema = normalizeTrimmedString(z.string().min(1, 'Skill name is required.').max(50, 'Skill name must not exceed 50 characters.'));

const skillItemSchema = z.union([
  skillNameSchema,
  z
    .object({
      id: z.number().int().positive().optional(),
      skillId: z.number().int().positive().optional(),
      name: skillNameSchema.optional(),
      type: z.enum(['OFFERED', 'WANTED']).optional(),
    })
    .strict(),
]);

const skillsCollectionSchema = z.union([
  z.array(skillItemSchema).max(100, 'You can update at most 100 skills at a time.'),
  z
    .object({
      offered: z.array(skillNameSchema).optional(),
      wanted: z.array(skillNameSchema).optional(),
    })
    .strict(),
]);

const booleanFromInput = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  return value;
}, z.boolean());

const registerSchema = z
  .object({
    name: normalizeTrimmedString(z.string().min(1, 'Name is required.').max(100, 'Name must not exceed 100 characters.')),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required.'),
  })
  .strict();

const profileUpdateSchema = z
  .object({
    name: normalizeTrimmedString(z.string().min(1, 'Name cannot be empty.').max(100, 'Name must not exceed 100 characters.')).optional(),
    profilePhoto: normalizeTrimmedString(z.string().min(1, 'Profile photo cannot be empty.').max(500, 'Profile photo must not exceed 500 characters.')).optional(),
    bio: normalizeTrimmedString(z.string().min(1, 'Bio cannot be empty.').max(1000, 'Bio must not exceed 1000 characters.')).optional(),
    location: normalizeTrimmedString(z.string().min(1, 'Location cannot be empty.').max(120, 'Location must not exceed 120 characters.')).optional(),
    availability: normalizeTrimmedString(z.string().min(1, 'Availability cannot be empty.').max(120, 'Availability must not exceed 120 characters.')).optional(),
    visibility: booleanFromInput.optional(),
    skills: skillsCollectionSchema.optional(),
  })
  .strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: 'At least one profile field must be provided.',
    path: ['body'],
  });

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
};