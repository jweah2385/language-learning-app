const HttpError = require('../models/http-error');
const simpleCard = require('../models/simpleCard');
const { default: mongoose } = require('mongoose');

const getSimpleCards = async (req, res, next) => {}

const getSimpleCardsById = async (req, res, next) => {}

const createSimpleCard = async (req, res, next) => {
    const { englishText, englishAudio, spanishText, spanishAudio
    } = req.body;   

    let existingCard;

    try {
        existingCard = await simpleCard.findOne({ englishText: englishText});
        if (existingCard) {
            const error = new HttpError(
                'Card already exists', 422
            )
            return next(error);
        }
    } catch (err) {
        const error = new HttpError(
            'Something went wrong try again.', 500
        );
        return next(error);
    }

    const createdSimmpleCard = new simpleCard({
        englishText,
        englishAudio,
        spanishText,
        spanishAudio
    })

    try {
        await createdSimmpleCard.save();
    } catch (err) {
        const error = new HttpError(
            'Creating card failed, please try again.',
            500
        )
        return next(error);
    }
    res.status(201).json({simpleCards: createdSimmpleCard.toObject({getters: true})})

}

const deleteSimpleCard = async (req, res, next) => {}

exports.getSimpleCards = getSimpleCards;
exports.getSimpleCardsById = getSimpleCardsById;
exports.createSimpleCard = createSimpleCard;
exports.deleteSimpleCard = createSimpleCard;
