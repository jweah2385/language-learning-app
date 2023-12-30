
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const translationSchema = new Schema({
    englishText: { type: String, required: true},
    spanishText: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, required: 
    true, ref: 'User'}
});


module.exports = mongoose.model('Translation', translationSchema);
