
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const advanceCardSchema = new Schema({
  englishText: { type: String, required: true },
  englishAudio: { type: String, required: true },
  spanishText: { type: String, required: true },
  spanishAudio: { type: String, required: true },
});

advanceCardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('advanceCard', advanceCardSchema);
