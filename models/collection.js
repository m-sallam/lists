const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collectionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date_created: { type: String },
  date_updated: { type: String },
  picture: { type: String },
  lists: [{ type: String, unique: true }]
})
const collectionModel = mongoose.model('Collection', collectionSchema)

module.exports = collectionModel
