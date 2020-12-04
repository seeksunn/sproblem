const mongoose = require('mongoose')
const Schema = mongoose.Schema
const exerciseSchema = new Schema({
  topic: String,
  content: String,
  words: Array
})
const ExerciseModel = mongoose.model('Exercise', exerciseSchema)
module.exports = ExerciseModel