const Item = require('../models/item')
const List = require('../models/list')
const request = require('request-promise-native')
var maxResults = 10

module.exports.searchItem = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })

  // search the API based on the item type
  switch (req.params.type) {
    case 'actor':
      await module.exports.searchActor(req, res, next)
      break
    case 'artist':
      await module.exports.searchArtist(req, res, next)
      break
    case 'show':
      await module.exports.searchShow(req, res, next)
      break
    case 'movie':
      await module.exports.searchMovie(req, res, next)
      break
    case 'song':
      await module.exports.searchSong(req, res, next)
      break
    case 'album':
      await module.exports.saerchAlbum(req, res, next)
      break
    case 'book':
      await module.exports.searchBook(req, res, next)
      break
    default:
      throw new Error('wrong type')
  }
  next()
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
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].profile_path
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        name: parsedResponse[index].title,
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].poster_path
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        picture: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/' + parsedResponse[index].poster_path
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        picture: parsedResponse[index].image[3]['#text']
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        picture: parsedResponse[index].image[3]['#text']
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        picture: parsedResponse[index].image[3]['#text']
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
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
        picture: parsedResponse[index].volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=2')
      })
    }
    res.send({ status: 'ok', result: result })
  } catch (err) {
    console.log('error with the search API - ', Date())
    console.log(err)
    return res.send({ status: 'API error', error: err.message })
  }
}

module.exports.addItem = async (req, res, next) => {
  // check if user is authenticated
  // if (!req.user) return res.send({ status: 'not logged in' })
  try {
    // check if item already exists in the database
    let item = await Item.findOne({ info: req.body.info })
    // create the item if it doesn't exist
    if (!item) {
      item = new Item({
        name: req.body.name,
        info: req.body.info,
        picture: req.body.picture,
        type: req.body.type
      })
    }
    // get the list data
    let list = await List.findOne({ _id: req.body.listId })
    // throw error if the list can not be found
    if (!list) throw new Error('Can not Find List')
    await item.save()
    list.items.push(item)
    await list.save()
    res.send({ status: 'ok' })
    next()
  } catch (err) {
    return res.send({ status: 'error', error: err.message })
  }
}
