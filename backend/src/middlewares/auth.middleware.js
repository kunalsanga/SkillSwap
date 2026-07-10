const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/appError');

const buildUserContext = (payload) => ({
  id: payload.userId,
  userId: payload.userId,
  email: payload.email,
  role: payload.role,
});

const authMiddleware = (req, _res, next) => {
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return next(new AppError('Authorization token is required.', 401));
  }

  const token = authorizationHeader.slice(7).trim();

  if (!token) {
    return next(new AppError('Authorization token is required.', 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      return next(new AppError('JWT secret is not configured.', 500));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || typeof decoded !== 'object') {
      return next(new AppError('Invalid token.', 401));
    }

    req.user = buildUserContext(decoded);
    return next();
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired.', 401));
    }

    return next(new AppError('Invalid token.', 401));
  }
};

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden.', 403));
    }

    return next();
  };
};

module.exports = { authMiddleware, authorize };
