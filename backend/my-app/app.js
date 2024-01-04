const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
require('dotenv').config();

const usersRoutes = require('./routes/users-route');
const translationsRoutes = require('./routes/translations-route');
const simpleCardsRoutes = require('./routes/simple-cards-route');
const mediumCardsRoutes = require('./routes/medium-cards-route');
const advanceCardsRoutes = require('./routes/advance-cards-route');

const app = express();

app.use(bodyParser.json());

app.use('/api/users/', usersRoutes);
app.use('/api/translations', translationsRoutes)
app.use('/api/simpleCards', simpleCardsRoutes);
app.use('/api/mediumCards', mediumCardsRoutes );
app.use('/api/advanceCards', advanceCardsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const mongoURL = process.env.REACT_APP_API_MONGOURL;

mongoose
  .connect(mongoURL)
  .then(() => {
    app.listen(5000);
    console.log('Connected to server')
  })
  .catch((err) => {
    console.log(err);
  });
