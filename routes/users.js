const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUserInfo } = require('../controllers/user');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

module.exports = router;
