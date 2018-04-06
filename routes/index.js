const router = require('express').Router()
const mainHandler = require('./main')
const itemHandler = require('./item')
const listHandler = require('./list')

router.route('/')
  .get(mainHandler.getHome)

router.route('/register')
  .get(mainHandler.getRegister)
  .post(mainHandler.register)

router.route('/login')
  .get(mainHandler.getLogin)
  .post(mainHandler.login)

router.route('/logout')
  .get(mainHandler.logout)

router.route('/api/search/:type/:query')
  .get(itemHandler.searchItem)

router.route('/api/add')
  .post(itemHandler.addItem)

router.route('/list')
  .post(listHandler.createList)
  .get(listHandler.getNewList)

router.route('/list/:id')
  .get(listHandler.getList)

router.route('/:user/lists')
  .get(listHandler.getLists)



module.exports = router
