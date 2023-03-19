const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const {
  login,
  createUser,
} = require('./controllers/users');
const BadRequestError = require('../errors/bad-request-err');
const ServerError = require('../errors/server-err');

const app = express();
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use((err, req, res, next) => {
  let { code: statusCode = 500 } = err;

  if (statusCode === 11000) {
    statusCode = 409;
  }

  res.status(statusCode).send({
    message: 'Произошла ошибка',
  });

  next();
});

app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.listen(3000);
