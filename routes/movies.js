const router = require('express').Router();
const { movieValid, movieDeleteValid } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', movieValid, createMovie);

router.delete('/:movieId', movieDeleteValid, deleteMovieById);

module.exports = router;
