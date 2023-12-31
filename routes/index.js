const router = require('express').Router();

const { errors } = require('celebrate');
const cors = require('../middlewares/cors');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { signinValid, signupValid } = require('../middlewares/validation');

const { login, createUser, signout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const NotFound = require('../utils/notFoundErr');

router.use(cors);

router.use(requestLogger);

router.post('/signin', signinValid, login);

router.post('/signup', signupValid, createUser);

router.use(auth);

router.post('/signout', signout);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.all('/', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

router.use(errorLogger);

router.use(errors());

router.use(errorHandler);

module.exports = router;
