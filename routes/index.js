const router = require('express').Router();

const { signinValid, signupValid } = require('../middlewares/validation');

const { login, createUser, signout } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const NotFound = require('../utils/notFoundErr');

router.post('/signin', signinValid, login);

router.post('/signup', signupValid, createUser);

router.use(auth);

router.post('/signout', signout);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.all('/', (req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

module.exports = router;
