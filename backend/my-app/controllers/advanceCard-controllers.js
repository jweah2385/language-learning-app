const HttpError = require('../models/http-error');
const advanceCard = require('../models/advanceCard');
const { default: mongoose } = require('mongoose');


const getAdvanceCards = async (req, res, next) => {
  let cards;
  try {
    cards = advanceCard.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching cards failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({
    advanceCards: (await cards).map((cards) =>
      cards.toObject({ getters: true })
    ),
  });
};

const getAdvanceCardsById = async (req, res, next) => {
  const advanceCardId = req.params.cid;
  let card;
  try {
    card = await advanceCard.findById(advanceCardId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not find card.',
      500
    );
    return next(error);
  }

  if (!card) {
    const error = new HttpError(
      'Could not find a card with the provided id.',
      404
    );
    return next(error);
  }

  res.json({ advanceCard: card.toObject({ getters: true }) });
};

const createAdvanceCard = async (req, res, next) => {
  const { englishText, englishAudio, spanishText, spanishAudio } = req.body;

  let existingCard;

  try {
    existingCard = await advanceCard.findOne({ englishText: englishText });
    if (existingCard) {
      const error = new HttpError('Card already exists', 422);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('Something went wrong try again.', 500);
    return next(error);
  }

  const createdAdvanceCard = new advanceCard({
    englishText,
    englishAudio,
    spanishText,
    spanishAudio,
  });

  try {
    await createdAdvanceCard.save();
  } catch (err) {
    const error = new HttpError('Creating card failed, please try again.', 500);
    return next(error);
  }
  res
    .status(201)
    .json({ mediumCards: createdAdvanceCard.toObject({ getters: true }) });
};

const deleteAdvanceCard = async (req, res, next) => {};


exports.getAdvanceCards = getAdvanceCards;
exports.getAdvanceCardsById = getAdvanceCardsById;
exports.createAdvanceCard = createAdvanceCard;
exports.deleteAdvanceCard = deleteAdvanceCard;
