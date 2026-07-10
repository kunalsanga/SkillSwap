const { AppError } = require('../utils/appError');

const formatZodErrors = (issues) => {
  return issues.map((issue) => ({
    field: issue.path.length ? issue.path.join('.') : 'body',
    message: issue.message,
  }));
};

const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new AppError('Validation failed', 400, formatZodErrors(result.error.issues)));
    }

    req[source] = result.data;
    return next();
  };
};

module.exports = { validate };