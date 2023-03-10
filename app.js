const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errors = require('./utils/errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6404fbacd9a874d0de58707e',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(errors.NOT_FOUND).send({ message: 'Route not found' });
});

app.listen(3000, () => {
});
