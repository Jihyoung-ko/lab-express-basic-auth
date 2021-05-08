const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {errorMessage: 'All fields are mandatory. Please provide your username and password.'});
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({ username, hashedPassword })
     })
    .then(() => res.redirect('/'))
    .catch(error => {
      if (error.code === 11000) {
        res.render('auth/signup', {errorMessage: 'Username is already used.'});
      } else {
        next(error);
      }
    });  
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) =>{
  const { username, password } = req.body;

  console.log('SESSEION ===>', req.session);

  if (!username || !password) {
    res.render('auth/login', {errorMessage: 'Please enter both username and passwork to log in.'});
    return;
  }

  User.findOne({username})
  .then(user => {
    if (!user) {
      res.render('auth/login', {errorMessage: 'Username is not registered. Try with other username.'});
      return;
    } else if (bcryptjs.compareSync(password, user.hashedPassword)) {
      // res.render('users/user-profile', { user });
      req.session.currentUser = user;
      res.redirect('/user-profile');

    } else {
      res.render('auth/login', {errorMessage: 'Incorrect password'});
    }
  })
  .catch(error => next(error));

});

router.get('/user-profile', (req, res) => {
  console.log('User', req.session.currentUser);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;
