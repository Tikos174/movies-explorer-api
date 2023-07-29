const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();
const NotFound = require('../utils/notFoundErr');
const IncorrectRequest = require('../utils/incorrectRequest');
const ConflictEmail = require('../utils/conflictEmail');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id');
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).cookie('authorization', token).send({ email });
    })
    .catch(next);
};

const signout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json('Пользователь вышел из системы');
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
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
