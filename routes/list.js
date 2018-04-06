const List = require('../models/list')
const User = require('../models/user')

module.exports.createList = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })
  try {
    let list = new List({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      date_created: Date(),
      date_updated: Date(),
      picture: ''
    })
    await list.save()
    let user = await User.findOne({ _id: req.user._id }).populate('lists')
    user.lists.push(list)
    await user.save()
    res.redirect(`/list/${list._id}`)
  } catch (err) {
    console.log(err, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.getList = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })
  try {
    let list = await List.findOne({ _id: req.params.id })
    res.send(list)
  } catch (err) {
    console.log(err, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.getLists = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })
  try {
    let user = await User.findOne({ username: req.params.user }).populate('lists')
    console.log(user.lists)
    res.render('lists', {lists: user.lists})
  } catch (err) {
    console.log(err, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.getNewList = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })
  try {
    res.render('newList')
  } catch (err) {
    console.log(err, Date())
    return res.send({ status: 'error', error: err.message })
  }
}