const router = require('express').Router();
const auth = require('../middlewares/auth');
const { movieValid, movieDeleteValid } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', auth, getMovies);

router.post('/', auth, movieValid, createMovie);

router.delete('/:movieId', auth, movieDeleteValid, deleteMovieById);

module.exports = router;
