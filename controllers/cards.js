const Card = require('../models/card');
const errors = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(errors.SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link, ownerId } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errors.BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(errors.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (!card.owner || card.owner._id !== req.user._id) {
        return res.status(403).send({ message: 'Нет прав' });
      }

      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errors.BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(errors.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errors.BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(errors.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(errors.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errors.BAD_REQUEST).send({ message: 'Ошибка валидации' });
      }
      return res.status(errors.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
