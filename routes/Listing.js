const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');
const { verifyToken } = require('../utils/tokenManager');
const mongoose = require('mongoose')


// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/', (req, res) => {
  Listing.find().populate('token').then(listings => res.send(listings))
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.post('/create', verifyToken, (req, res) => {
  const userId = req.userId
  User.findById(userId).populate('listings').then(user => {
    const newListing = new Listing({
      description: req.body.description,
      price: parseInt(req.body.price),
      quantity: req.body.quantity,
      seller: user.username,
      token: req.body.tokenId,
    })
    newListing.save().then(listing => {
      user.listings.push(listing)
      user.save().then(() => res.send({message: 'Listing successfully added'})).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/token/:tokenId', (req, res) => {
  Listing.find({token: mongoose.Types.ObjectId(req.params.tokenId)}).then(listings => res.send(listings))
});

module.exports = router;