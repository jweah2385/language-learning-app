
// const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Translation = require('../models/translation');
const { default: mongoose } = require('mongoose');

const getTranslationById = async (req, res, next) => {
    //tid must match what is in the router file
    const translationId = req.params.tid;

    let translation;
    try {
        //finding translations by Id of the translation
        translation = await Translation.findById(translationId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong could not find a translation', 500
        );
        return next(error);
    }

    if (!translation) {
        const error = new HttpError(
            'Could not find a translation with the provided id.',
            404
        );
        return next(error);
    }

    res.json({ translation: translation.toObject({ getters: true })})
}

const getTranslationsByUserId = async (req, res, next) => {
    const UserId = req.params.tid;

    let userWithTranslation;

    try {
        userWithTranslation = await User.findById(UserId).populate('translations')
        console.log(userWithTranslation)
    } catch (err) {
        const error = new HttpError(
            'Fetching translations failed, please try again later',
            500
        );
        return next(error);
    }

    if (!userWithTranslation ||  userWithTranslation.translations.length === 0) {
        return next(
            new HttpError('Could not find translations for the provided user', 404)
        );
    }

    res.json({
        translations: userWithTranslation.translations.map((translation) => 
            translation.toObject({ getters: true })
        ),
    })
}

const createTranslation = async (req, res, next) => {
    
    //Getting user input 
    const { englishText, spanishText, creator } = req.body;

    const createdTranslation = new Translation({
        englishText,
        spanishText,
        creator,
    })

    let user;
    let sess;

    try {
        sess = await mongoose.startSession();
        sess.startTransaction();

        user = await User.findById(creator);
        if (!user) {
            throw new HttpError('Could not find user for provided id', 404)
        } 

        await createdTranslation.save({ session: sess });
        user.translations.push(createdTranslation)
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.error(err);
        if (sess) {
            await sess.abortTransaction();
        }
        return next(new HttpError('Creating translation failed, please try again', 500))
    } finally {
        if (sess) {
            sess.endSession();
        }
    }

    res.status(201).json({ translation: createdTranslation });
}

const deleteTranslation = async (req, res, next) => {
    const translationId = req.params.tid;
    let sess;

    try {
        sess = await mongoose.startSession();
        sess.startTransaction();

        const translation = await Translation.findById(translationId).populate('creator');      
        if (!translationId) {
            throw new HttpError('Could not find translation for this id', 404 );
        }
        //Remove the translation from the database
        await Translation.deleteOne({ _id: translationId }, { session: sess });
        
        //Remove the reference to the translation from the creator
        translation.creator.translations.pull(translation);
        await translation.creator.save({ session: sess });

        await sess.commitTransaction();
    } catch (err) {
        console.error(err);
        if(sess) {
            await sess.abortTransaction();
        }
         return next(
           new HttpError('Something went wrong, could not delete place.', 500)
         );
    } finally {
         if (sess) {
            await sess.endSession();
        }
    }

    res.status(200).json({ message: 'Deleted place.'})
  
};

exports.getTranslationById = getTranslationById;
exports.getTranslationsByUserId = getTranslationsByUserId;
exports.createTranslation = createTranslation;
exports.deleteTranslation = deleteTranslation;

