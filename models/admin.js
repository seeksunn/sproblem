const mongoose = require('mongoose')
const Schema = mongoose.Schema
const adminSchema = new Schema({
  password: String
})
const AdminModel = mongoose.model('Admin', adminSchema)
module.exports = AdminModel