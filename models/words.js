const mongoose = require('mongoose')
const Schema = mongoose.Schema
const wordsSchema = new Schema({
  words: String
})
const wordsModel = mongoose.model('Words', wordsSchema)
module.exports = wordsModel