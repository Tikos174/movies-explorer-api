const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { rateLimiter } = require('./middlewares/rateLimiter');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(('mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser());

app.use(require('./routes/index'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
