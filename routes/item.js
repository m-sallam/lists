const Item = require('../models/item')
const List = require('../models/list')
const request = require('request-promise-native')
var maxResults = 10

module.exports.searchItem = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // search the API based on the item type
    switch (req.params.type) {
      case 'Actors / Actresses':
        await module.exports.searchActor(req, res, next)
        break
      case 'Artists':
        await module.exports.searchArtist(req, res, next)
        break
      case 'Shows':
        await module.exports.searchShow(req, res, next)
        break
      case 'Movies':
        await module.exports.searchMovie(req, res, next)
        break
      case 'Songs':
        await module.exports.searchSong(req, res, next)
        break
      case 'Albums':
        await module.exports.saerchAlbum(req, res, next)
        break
      case 'Books':
        await module.exports.searchBook(req, res, next)
        break
      default:
        throw new Error('requesting to search an item of unkown type: ' + req.params.type)
    }
  } catch (err) {
    console.log(err.message, Date())
    res.send({ status: 'API error' })
  }
}

// get the top results of the query search and send them to the client

module.exports.searchActor = async (req, res, next) => {
  try {
    let apiURL = `https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDBAPI}&query=${req.params.query}`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: 'https://www.themoviedb.org/person/' + parsedResponse[index].id,
        name: parsedResponse[index].name,
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].profile_path,
        type: 'Actors / Actresses'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error' })
  }
}

module.exports.searchShow = async (req, res, next) => {
  try {
    let apiURL = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDBAPI}&query=${req.params.query}`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: 'https://www.themoviedb.org/tv/' + parsedResponse[index].id,
        name: parsedResponse[index].name,
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].poster_path,
        type: 'Shows'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error' })
  }
}

module.exports.searchMovie = async (req, res, next) => {
  try {
    let apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDBAPI}&query=${req.params.query}`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: 'https://www.themoviedb.org/movie/' + parsedResponse[index].id,
        name: parsedResponse[index].title,
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].poster_path,
        type: 'Movies'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error' })
  }
}

module.exports.saerchAlbum = async (req, res, next) => {
  try {
    let apiURL = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${req.params.query}&api_key=${process.env.LASTFMAPI}&format=json`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results.albummatches.album
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: parsedResponse[index].url,
        name: parsedResponse[index].name + ' | ' + parsedResponse[index].artist,
        picture: parsedResponse[index].image[3]['#text'],
        type: 'Albums'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error', error: err.message })
  }
}

module.exports.searchArtist = async (req, res, next) => {
  try {
    let apiURL = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${req.params.query}&api_key=${process.env.LASTFMAPI}&format=json`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results.artistmatches.artist
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: parsedResponse[index].url,
        name: parsedResponse[index].name + ' | ' + parsedResponse[index].artist,
        picture: parsedResponse[index].image[3]['#text'],
        type: 'Artists'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error', error: err.message })
  }
}

module.exports.searchSong = async (req, res, next) => {
  try {
    let apiURL = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${req.params.query}&api_key=${process.env.LASTFMAPI}&format=json`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).results.trackmatches.track
    let resultLengthBool = parsedResponse.length <= maxResults
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : maxResults); index++) {
      result.push({
        info: parsedResponse[index].url,
        name: parsedResponse[index].name,
        picture: parsedResponse[index].image[3]['#text'],
        type: 'Songs'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error', error: err.message })
  }
}

module.exports.searchBook = async (req, res, next) => {
  try {
    let apiURL = `https://www.googleapis.com/books/v1/volumes?q=${req.params.query}&maxResults=10&key=${process.env.BOOKSAPI}`
    let response = await request(apiURL)

    let result = []
    let parsedResponse = JSON.parse(response).items
    let resultLengthBool = parsedResponse.length <= 10
    for (let index = 0; index < (resultLengthBool ? parsedResponse.length : 10); index++) {
      result.push({
        info: parsedResponse[index].volumeInfo.infoLink,
        name: parsedResponse[index].volumeInfo.title,
        picture: parsedResponse[index].volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=2'),
        type: 'Books'
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'API error', error: err.message })
  }
}

module.exports.addItem = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // check if item already exists in the database
    let item = await Item.findOne({ info: req.body.item.info })
    // create the item if it doesn't exist
    if (!item) {
      item = new Item({
        name: req.body.item.name,
        info: req.body.item.info,
        picture: req.body.item.picture,
        type: req.body.item.type
      })
      await item.save()
    }
    // get the list data
    let list = await List.findOne({ _id: req.body.listId }).populate('user').populate('items')
    // throw error if the list can not be found
    if (!list) throw new Error('an item was attempted to be assigned to a non existent list')
    // cgeck if the current user owns the list
    if (req.user.username !== list.user.username) throw new Error('Access denied')
    // check if item already exists in the list
    for (let i of list.items) {
      if (i._id.equals(item._id)) throw new Error('Item already exists in the list')
    }
    list.items.push(item)
    list.date_updated = Date()
    await list.save()
    res.send({ status: 'ok' })
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.removeItem = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    // get item data
    let item = await Item.findOne({ info: req.body.itemInfo })
    // check if item exists
    if (!item) throw new Error('item does not exits')
    // get the list data
    let list = await List.findOne({ _id: req.body.listId }).populate('user').populate('items')
    // throw error if the list can not be found
    if (!list) throw new Error('an item was attempted to be removed from a non existent list')
    // cgeck if the current user owns the list
    if (req.user.username !== list.user.username) throw new Error('Access denied')
    // check if item already exists in the list
    for (let i of list.items) {
      if (i._id.equals(item._id)) {
        list.items.splice(list.items.indexOf(i), 1)
        list.date_updated = Date()
        await list.save()
        return res.send({ status: 'ok' })
      }
    }
    throw new Error('item is not in the list')
  } catch (err) {
    console.log(err.message, Date())
    return res.send({ status: 'error', error: err.message })
  }
}

module.exports.getNewItem = async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) return res.redirect('/login')
  try {
    let list = await List.findOne({ _id: req.params.id })
    res.render('newItem', { list: list })
  } catch (err) {
    console.log(err.message, Date())
    return res.render('error')
  }
}
