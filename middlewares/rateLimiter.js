const rateLimiters = require('express-rate-limit');

const rateLimiter = rateLimiters({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };
