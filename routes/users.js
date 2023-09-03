const router = require('express').Router();
const { getUser, updateUserInfo } = require('../controllers/user');
const { user } = require('../middlewares/validation');

router.get('/me', getUser);

router.patch('/me', user, updateUserInfo);

module.exports = router;
