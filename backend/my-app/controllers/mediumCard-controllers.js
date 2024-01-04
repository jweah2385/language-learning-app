const HttpError = require('../models/http-error');
const mediumCard = require('../models/mediumCard');
const { default: mongoose } = require('mongoose');

const getMediumCards = async (req, res, next) => {
        let cards;
    try {
        cards = mediumCard.find({});
    } catch (err) {
        const error = new HttpError(
            'Fetching cards failed, please try again later.', 500
        );
        return next(error);
    }
    res.json({mediumCards: (await cards).map(cards => cards.toObject({ getters: true}))});
};

const getMediumCardsById = async (req, res, next) => {
     const mediumCardId = req.params.cid;
     let card;
     try {
       card = await mediumCard.findById(mediumCardId);
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

     res.json({ mediumCard: card.toObject({ getters: true})})
}

const createMediumCard = async (req, res, next) => {
    const { englishText, englishAudio, spanishText, spanishAudio } = req.body;

    let existingCard;

    try {
      existingCard = await mediumCard.findOne({ englishText: englishText });
      if (existingCard) {
        const error = new HttpError('Card already exists', 422);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError('Something went wrong try again.', 500);
      return next(error);
    }

    const createdMediumCard = new mediumCard({
      englishText,
      englishAudio,
      spanishText,
      spanishAudio,
    });

    try {
      await createdMediumCard.save();
    } catch (err) {
      const error = new HttpError(
        'Creating card failed, please try again.',
        500
      );
      return next(error);
    }
    res
      .status(201)
      .json({ mediumCards: createdMediumCard.toObject({ getters: true }) });
};

const deleteMediumCard = async (req, res, next) => {};

exports.getMediumCards = getMediumCards;
exports.getMediumCardsById = getMediumCardsById;
exports.createMediumCard = createMediumCard;
exports.deleteMediumCard = createMediumCard;
