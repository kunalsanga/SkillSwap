const { authorize } = require('./auth.middleware');

const adminMiddleware = authorize('ADMIN');

module.exports = { adminMiddleware };
