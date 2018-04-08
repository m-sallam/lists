const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  name: { type: String, required: true },
  info: { type: String, unique: true, required: true },
  picture: { type: String, required: true },
  type: { type: String, required: true } // Actors / Actresses, Artists, Albums, Songs, Movies, Shows, Books
})
const itemModel = mongoose.model('Item', itemSchema)

module.exports = itemModel
