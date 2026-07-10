
/**
 * Validate that required fields are present and not empty.
 * @param {Object} fieldsObj Object mapping field names to their values.
 * @returns {Array<{field: string, message: string}>} Array of errors, empty if valid.
 */
const validateFields = (fieldsObj) => {
  const errors = [];
  for (const [key, value] of Object.entries(fieldsObj)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      errors.push({ field: key, message: `${key} is required and cannot be empty.` });
    }
  }
  return errors;
};

/**
 * Validate that an ID is a valid positive integer.
 * @param {any} id The ID value.
 * @param {string} fieldName The name of the field.
 * @returns {{value?: number, error?: string}} Object containing parsed value or error string.
 */
const validateId = (id, fieldName = 'id') => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0 || String(parsed) !== String(id).trim()) {
    return { error: `${fieldName} must be a valid positive integer.` };
  }
  return { value: parsed };
};

/**
 * Validate skill name.
 * @param {string} name Skill name string.
 * @returns {string|null} Error message or null if valid.
 */
const validateSkillName = (name) => {
  if (typeof name !== 'string') {
    return 'Skill name must be a string.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return 'Skill name must be between 2 and 50 characters.';
  }
  // Reject skill names that contain invalid characters like special symbols
  // Allow alphanumeric, spaces, dots, dashes, hashes, slashes, pluses (e.g. C++, Node.js, React Native)
  const regex = /^[a-zA-Z0-9\s.+\-#/]+$/;
  if (!regex.test(trimmed)) {
    return 'Skill name contains invalid characters.';
  }
  return null;
};

/**
 * Validator middleware generator to handle validation responses.
 */
const validateBody = (rules) => {
  return (req, res, next) => {
    const errors = [];
    
    // Check required fields
    if (rules.required) {
      const fieldsObj = {};
      rules.required.forEach(field => {
        fieldsObj[field] = req.body[field];
      });
      const fieldErrors = validateFields(fieldsObj);
      errors.push(...fieldErrors);
    }

    // Check ID validations
    if (rules.ids) {
      rules.ids.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          const { error } = validateId(req.body[field], field);
          if (error) {
            errors.push({ field, message: error });
          }
        }
      });
    }

    // Check rating range
    if (rules.rating) {
      const rating = req.body[rules.rating];
      if (rating !== undefined && rating !== null) {
        const ratingVal = parseInt(rating, 10);
        if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
          errors.push({ field: rules.rating, message: `${rules.rating} must be an integer between 1 and 5.` });
        }
      }
    }

    // Check skill name validation
    if (rules.skillName) {
      const skillName = req.body[rules.skillName];
      if (skillName !== undefined && skillName !== null) {
        const err = validateSkillName(skillName);
        if (err) {
          errors.push({ field: rules.skillName, message: err });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        errors
      });
    }

    next();
  };
};

module.exports = {
  validateFields,
  validateId,
  validateSkillName,
  validateBody,
};
