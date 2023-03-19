const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errors = require('./utils/errors');
const {
  login,
  createUser,
} = require('./controllers/users');

const app = express();
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(errors.NOT_FOUND).send({ message: 'Route not found' });
});

app.listen(3000, () => {
});
