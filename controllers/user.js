const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();
const NotFound = require('../utils/notFoundErr');
const IncorrectRequest = require('../utils/incorrectRequest');
const ConflictEmail = require('../utils/conflictEmail');
const NotАuthorized = require('../utils/notAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotАuthorized('Неправильная почта или пароль.');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new NotАuthorized('Неправильная почта или пароль.');
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.status(200).send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const signout = (req, res) => {
  res.clearCookie('authorization');
  res.status(200).json('Пользователь вышел из системы');
};

const createUser = (req, res, next) => {
  const { email, name } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((newUser) => {
      res.status(200).send({
        email: newUser.email,
        name: newUser.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest('При регистрации пользователя произошла ошибка'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictEmail('Пользователь с данным Email уже зарегистрирован'));
        return;
      } next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectRequest('При обновлении профиля произошла ошибка'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictEmail('Пользователь с данным Email уже зарегистрирован'));
        return;
      } next(err);
    });
};

module.exports = {
  getUser, login, signout, createUser, updateUserInfo,
};
