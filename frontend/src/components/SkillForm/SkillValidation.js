/**
 * Validates the inputs of the Skill Form.
 * @param {Object} values - { name, category, experience, description }
 * @returns {Object} errors - Keys represent fields with errors, values are messages.
 */
export const validateSkill = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Skill name is required.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Skill name must be at least 2 characters.';
  } else if (values.name.trim().length > 50) {
    errors.name = 'Skill name must not exceed 50 characters.';
  }

  if (values.category && values.category.trim().length > 100) {
    errors.category = 'Category must not exceed 100 characters.';
  }

  if (values.experience && values.experience.trim().length > 100) {
    errors.experience = 'Experience level must not exceed 100 characters.';
  }

  if (values.description && values.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters.';
  }

  return errors;
};
