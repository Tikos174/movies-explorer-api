const router = require('express').Router();
const auth = require('../middlewares/auth');
const { getUser, updateUserInfo } = require('../controllers/user');
const { user } = require('../middlewares/validation');

router.get('/me', auth, getUser);

router.patch('/me', auth, user, updateUserInfo);

module.exports = router;
