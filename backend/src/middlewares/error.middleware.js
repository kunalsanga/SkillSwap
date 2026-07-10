const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = Array.isArray(err.errors) ? err.errors : [];

  logger.error(`[${req.method}] ${req.url} >> StatusCode:: ${statusCode}, Message:: ${message}`);

  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
    errors,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorMiddleware };
