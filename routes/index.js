const router = require('express').Router();
const { celebrate, errors, Joi } = require('celebrate');
const cors = require('../middlewares/cors');
const { requestLogger, errorLogger } = require('../middlewares/logger');

const { login, createUser, signout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const NotFound = require('../utils/notFoundErr');

router.use(cors);

router.use(requestLogger);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signout', signout);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

router.use(errorLogger);

router.use(errors());

router.use(errorHandler);

module.exports = router;
