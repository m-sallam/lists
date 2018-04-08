const List = require('../models/list')
const User = require('../models/user')
const Collection = require('../models/collection')

module.exports.createList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    let list = new List({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      date_created: Date(),
      date_updated: Date(),
      picture: '',
      user: req.user
    })
    await list.save()
    let user = await User.findOne({ _id: req.user._id }).populate('lists')
    user.lists.push(list)
    await user.save()
    res.redirect(`/list/${list._id}`)
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getList = async (req, res, next) => {
  // check if user is authenticated
  try {
    let list = await List.findOne({ _id: req.params.id }).populate('items').populate('user')
    res.render('list', { list: list, user: list.user })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getLists = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.user }).populate('lists')
    res.render('lists', { lists: user.lists, user: user })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getNewList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    res.render('newList')
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.getAddList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    let collection = await Collection.findOne({ _id: req.params.id })
    let user = await User.findOne({ _id: req.user._id }).populate('lists')
    res.render('addList', { collection: collection, lists: user.lists })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}

module.exports.addList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    let collection = await Collection.findOne({ _id: req.params.id }).populate('user').populate('lists')
    if (!collection) throw new Error('a list was attempted to be assigned to a non existent collection')
    // get the list data
    let list = await List.findOne({ _id: req.body.listId }).populate('user')
    // throw error if the list can not be found
    if (!list) throw new Error('a non existent list was attempted to be assigned to a collection')
    // check if the current user is the owner
    if ((req.user.username !== collection.user.username) || (req.user.username !== list.user.username)) throw new Error('Access denied')
    // check if list already exists in the collection
    for (let l of collection.lists) {
      if (l._id.equals(list._id)) throw new Error('List already exists in the collection')
    }
    collection.lists.push(list)
    collection.date_updated = Date()
    await collection.save()
    res.send({ status: 'ok' })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.removeList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // get list data
    let list = await List.findOne({ _id: req.body.listId }).populate('user')
    // check if list exists
    if (!list) throw new Error('list does not exist')
    // get the collection data
    let collection = await Collection.findOne({ _id: req.body.collectionId }).populate('user').populate('lists')
    // throw error if the collection can not be found
    if (!collection) throw new Error('a list was attempted to be removed from a non existent collection')
    // cgeck if the current user owns the collection
    if ((req.user.username !== collection.user.username) || (req.user.username !== list.user.username)) throw new Error('Access denied')
    // check if list already exists in the collection
    for (let i of collection.lists) {
      if (i._id.equals(list._id)) {
        collection.lists.splice(collection.lists.indexOf(i), 1)
        collection.date_updated = Date()
        await collection.save()
        return res.send({ status: 'ok' })
      }
    }
    throw new Error('list is not in the collection')
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.deleteList = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // get list data
    let list = await List.findOne({ _id: req.params.id }).populate('user')
    // check if list exists
    if (!list) throw new Error('list does not exist')
    // cgeck if the current user owns the list
    if ((req.user.username !== list.user.username)) throw new Error('Access denied')

    // get all user collections to remove the list from them
    let collections = await Collection.find({ user: req.user._id }).populate('lists')

    // user data to remove the list from it
    let user = await User.findOne({ _id: req.user._id }).populate('lists')

    // remove the list from all collections
    for (let collection of collections) {
      for (let i of collection.lists) {
        if (i._id.equals(list._id)) {
          collection.lists.splice(collection.lists.indexOf(i), 1)
          collection.date_updated = Date()
          await collection.save()
        }
      }
    }
    // remove the list from the user data
    for (let i of user.lists) {
      if (i._id.equals(list._id)) {
        user.lists.splice(user.lists.indexOf(i), 1)
        await user.save()
        await List.remove({ _id: req.params.id })
        return res.send({ status: 'ok' })
      }
    }
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}
