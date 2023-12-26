const { text } = require('body-parser');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const simpleCardSchema = new Schema({
  englishText: { type: String, required: true },
  englishAudio: { type: String, required: true},
  spanishText: { type: String, required: true },
  spanishAudio: { type: String, required: true}
});

simpleCardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('SimpleCard', simpleCardSchema);
