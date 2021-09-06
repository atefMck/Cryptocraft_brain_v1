const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/', (req, res) => {
  User.find()
      .then(users => res.json(users))
});

// @route   POST api/users
// @desc    POST new user
// @access  Public
router.post('/', (req, res) => {
  const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
  });
  
  newUser.save().then(user => res.json(user));
});

module.exports = router;