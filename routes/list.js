const List = require('../models/list')

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
    res.redirect(`/list/${list._id}`)
    next()
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
    next()
  } catch (err) {
    console.log(err, Date())
    return res.send({ status: 'error', error: err.message })
  }
}
