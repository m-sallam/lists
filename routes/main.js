const passport = require('passport')
const User = require('../models/user')

module.exports.getHome = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('landing')
  res.render('home')
}

module.exports.getRegister = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('register')
  res.redirect('/')
}

module.exports.register = async (req, res, next) => {
  try {
    await User.register(new User({ username: req.body.username, email: req.body.email, name: req.body.name }), req.body.password)
    console.log(`new user added: ${req.body.username}  ==> `, Date())
    passport.authenticate('local', { successRedirect: '/', successFlash: `Welcome, ${req.body.username}!` })(req, res)
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'E-mail already exists')
    } else {
      req.flash('error', err.message)
    }
    console.log(err.message, Date())
    res.redirect('/register')
  }
}

module.exports.getLogin = async (req, res, next) => {
  // check if the user is authenticated or not
  if (!req.user) return res.render('login')
  res.redirect('/')
}

module.exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', function (err, user, info) {
      if (err) throw new Error(err)
      if (!user) {
        req.flash('error', 'Invalid Password/Username.')
        return res.redirect('/login')
      }
      req.logIn(user, function (err) {
        if (err) throw new Error(err)
        req.flash('success', `Welcome back, ${req.body.username}!`)
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
        console.log(`User ${req.body.username} signed in ==> `, Date())
        return res.redirect('/')
      })
    })(req, res, next)
  } catch (err) {
    console.log(err.message, Date())
    res.redirect('/login')
  }
}

module.exports.logout = async (req, res, next) => {
  try {
    req.logout()
    res.redirect('/')
  } catch (err) {
    console.log(err.message, Date())
    res.render('error')
  }
}
