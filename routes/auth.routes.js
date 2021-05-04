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

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({ username, hashedPassword })
     })
    .then(() => res.redirect('/'))
    .catch(error => next(error));
});

module.exports = router;
