const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: { type: String, required: true },
  info: { type: String, unique: true, required: true },
  picture: { type: String, required: true },
  type: { type: String, required: true } // actor, artist, album, song, movie, show, book
})
const itemModel = mongoose.model('Item', itemSchema)

module.exports = itemModel
