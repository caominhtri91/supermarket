const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({ min: 6 });

  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });

    return done(null, false, req.flash('error', messages));
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, false, { message: 'Email already in used' });
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save((error, result) => {
      if (error) {
        return done(error);
      }

      return done(null, newUser);
    });
  });
}));
