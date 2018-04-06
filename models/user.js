const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, unique: true, required: true, min: 5, max: 32 },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection', unique: true }]
})
userSchema.plugin(passportLocalMongoose)
const userModel = mongoose.model('User', userSchema)

module.exports = userModel
