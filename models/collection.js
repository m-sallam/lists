const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const Schema = mongoose.Schema

const collectionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  date_created: { type: String },
  date_updated: { type: String },
  picture: { type: String },
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})
collectionSchema.plugin(deepPopulate)
const collectionModel = mongoose.model('Collection', collectionSchema)

module.exports = collectionModel
