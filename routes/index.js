const router = require('express').Router()
const mainHandler = require('./main')
const itemHandler = require('./item')
const listHandler = require('./list')
const CollectionHandler = require('./collection')

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

router.route('/api')
  .delete(itemHandler.removeItem)

router.route('/list')
  .post(listHandler.createList)
  .get(listHandler.getNewList)
  .delete(listHandler.removeList)

router.route('/list/:id')
  .get(listHandler.getList)
  .delete(listHandler.deleteList)

router.route('/list/:id/add')
  .get(itemHandler.getNewItem)

router.route('/:user/lists')
  .get(listHandler.getLists)

router.route('/Collection')
  .post(CollectionHandler.createCollection)
  .get(CollectionHandler.getNewCollection)

router.route('/Collection/:id')
  .get(CollectionHandler.getCollection)
  .delete(CollectionHandler.deleteCollection)

router.route('/Collection/:id/add')
  .post(listHandler.addList)
  .get(listHandler.getAddList)

router.route('/:user/Collections')
  .get(CollectionHandler.getCollections)

module.exports = router
