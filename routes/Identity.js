const express = require('express');
const router = express.Router();
const {createIdentity, syncIdentity, linkIdentity} = require('../sync/Identity');
const Identity = require('../models/Identity');
const User = require('../models/User');
const { verifyToken } = require('../utils/tokenManager');


// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.post('/createIdentity', verifyToken, (req, res) => {
  const userId = req.userId;
  User.findById(userId).populate('identities').then(user => {
    createIdentity(user.id).then(savedIdentitiy => {
      user.identities.push(savedIdentitiy)
      user.save(savedUser => {
        res.send(savedUser)
      })
    }).catch(err => console.log(err.response.status))
  })
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.post('/syncIdentity', verifyToken, (req, res) => {
  const userId = req.userId;
  User.findById(userId).populate('identity').then(user => {
    syncIdentity(user.identity).then(identity => res.send(identity))
  })
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.post('/linkIdentity', verifyToken, (req, res) => {
  const userId = req.userId;
  User.findById(userId).populate('identity').then(user => {
    linkIdentity(user.identity).then(identity => res.send(identity))
  })
});

module.exports = router;