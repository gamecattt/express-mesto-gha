const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const {
  login,
  createUser,
} = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const constants = require('./utils/constants');

const app = express();
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    avatar: Joi.string().regex(constants.URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('Route not found');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { code = 500, message } = err;

  res.status(code).send({
    message: code === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(3000);
