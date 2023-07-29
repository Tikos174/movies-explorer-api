const token = require('jsonwebtoken');
const NotАuthorized = require('../utils/notAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new NotАuthorized('Необходима авторизация'));
  }
  let payload;
  try {
    payload = token.verify(authorization, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new NotАuthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
