const passport = require('passport')
const User = require('../models/user')

module.exports.getHome = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('landing')
  res.render('home')
  next()
}

module.exports.getRegister = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('register')
  res.redirect('/')
  next()
}

module.exports.register = async (req, res, next) => {
  try {
    await User.register(new User({ username: req.body.username, email: req.body.email, name: req.body.name }), req.body.password)
    passport.authenticate('local', { successRedirect: '/' })(req, res)
  } catch (err) {
    console.log(err.message, Date())
    req.flash('error', err.message)
    res.redirect('/register')
  }
}

module.exports.getLogin = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('login')
  res.redirect('/')
  next()
}

module.exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', { failureFlash: 'Invalid Password/Username.', successRedirect: '/', failureRedirect: '/login' })(req, res)
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
  } catch (err) {
    console.log(err.message)
    res.redirect('/login')
  }
}

module.exports.logout = async (req, res, next) => {
  req.logout()
  res.redirect('/')
  next()
}
