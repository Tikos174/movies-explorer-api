const Movie = require('../models/movie');
const NotFound = require('../utils/notFoundErr');
const IncorrectRequest = require('../utils/incorrectRequest');
const ForbiddenError = require('../utils/forbiddenErr');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(201).send(movies))
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectRequest('Введены неверные данные при создании фильма'),
        );
        return;
      }
      next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Данный фильм не найден');
      } else if (!(req.user._id === movie.owner._id.toString())) {
        throw new ForbiddenError('Запрещено удалять чужие фильмы');
      } else {
        Movie.deleteOne({ _id: req.params.movieId })
          .then((myMovie) => {
            res.status(200).send({ myMovie });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getMovies, createMovie, deleteMovieById };
