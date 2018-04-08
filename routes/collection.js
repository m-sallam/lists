const Collection = require('../models/collection')
const User = require('../models/user')

module.exports.createCollection = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    let collection = new Collection({
      name: req.body.name,
      description: req.body.description,
      date_created: Date(),
      date_updated: Date(),
      picture: '',
      user: req.user
    })
    await collection.save()
    let user = await User.findOne({ _id: req.user._id }).populate('collections')
    user.collections.push(collection)
    await user.save()
    res.redirect(`/collection/${collection._id}`)
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getCollection = async (req, res, next) => {
  try {
    let collection = await Collection.findOne({ _id: req.params.id }).populate('lists').populate('user')
    res.render('collection', { collection: collection, user: collection.user })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getCollections = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.user }).populate('collections')
    user = await User.populate(user, 'collections.lists')
    res.render('collections', { collections: user.collections, user: user })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getNewCollection = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    res.render('newCollection')
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.deleteCollection = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // get collection data
    let collection = await Collection.findOne({ _id: req.params.id }).populate('user')
    // check if collection exists
    if (!collection) throw new Error('collection does not exist')
    // cgeck if the current user owns the collection
    if ((req.user.username !== collection.user.username)) throw new Error('Access denied')

    // user data to remove the collection from it
    let user = await User.findOne({ _id: req.user._id }).populate('collections')

    // remove the collection from the user data
    for (let i of user.collections) {
      if (i._id.equals(collection._id)) {
        user.collections.splice(user.collections.indexOf(i), 1)
        await user.save()
        await Collection.remove({ _id: req.params.id })
        return res.send({ status: 'ok' })
      }
    }
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}
