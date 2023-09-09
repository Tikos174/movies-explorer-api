const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimiter');
const router = require('./routes');
const { centralErrorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(('mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors);
app.use(limiter);

app.use(router);

app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
