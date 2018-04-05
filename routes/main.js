const passport = require('passport')
const User = require('../models/user')

module.exports.getHome = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.send('landing')
  res.send('home')
  next()
}

module.exports.getRegister = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.send('register')
  res.send('home')
  next()
}

module.exports.postRegister = async (req, res, next) => {
  // validate fields
  let errors = { errors: [] }
  if (!req.body.terms) errors.errors.push('You have to agree to terms')
  if (req.body.password) errors.errors.push('Password is required')
  if (req.body.password !== req.body.repeatPassword) errors.errors.push('Passwords do not match')
  if (errors.errors.length > 0) {
    req.flash('error', JSON.stringify(errors))
    return res.redirect('/register')
  }
  try {
    await User.register(new User({ username: req.body.username, email: req.body.email, name: req.body.name }), req.body.password)
    passport.authenticate('local')(req, res, () => {
      res.redirect('/')
      next()
    })
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/register')
  }
}

module.exports.getLogin = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.send('login')
  res.send('home')
  next()
}

module.exports.postLogin = async (req, res, next) => {
  passport.authenticate('local', {
    failureFlash: 'Invalid Password/Username.',
    failureRedirect: '/join'
  }, (req, res) => {
    if (req.body.remember) {
      // delete the cookie after 30 days if inactivity if the remember me check is checked
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
    } else {
      req.session.cookie.maxAge = null
    }
    res.redirect('/')
    next()
  })
}

module.exports.logout = async (req, res, next) => {
  req.logout()
  res.redirect('/')
  next()
}
