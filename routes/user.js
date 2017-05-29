const express = require('express');
const passport = require('passport');
const csrf = require('csurf');

const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/signup', (req, res) => {
  const messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages, hasError: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: 'signup',
  failureFlash: true
}), (req, res, next) => {
  res.redirect('/user/profile');
});

router.get('/signin', (req, res) => {
  res.render('user/signin');
});

router.get('/profile', (req, res) => {
  res.render('user/profile');
});

module.exports = router;
