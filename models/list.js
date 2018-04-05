const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  date_created: { type: String },
  date_updated: { type: String },
  picture: { type: String },
  items: [{ type: String, unique: true }]
})
const listModel = mongoose.model('List', listSchema)

module.exports = listModel
