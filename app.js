const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')
require('dotenv').config()

const User = require('./models/user')

const routes = require('./routes')

const dbUrl = process.env.DBURL || 'mongodb://localhost/yts-watch-list-dev'
mongoose.connect(dbUrl, (err) => {
  if (err) return err
  console.log('connect to database --> ', Date())
})
const store = new MongoDBStore({ mongooseConnection: mongoose.connection })
app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: true,
  store: store,
  unset: 'destroy',
  name: 'session cookie name'
}))
app.use(flash())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'vash')
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

app.use(routes)

app.listen(3000, () => {
  console.log('Server Strated --> ', Date())
})
