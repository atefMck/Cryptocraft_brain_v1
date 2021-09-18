const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { verifyToken } = require('../utils/tokenManager');


// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/', (req, res) => {
  Offer.find().populate('user').then(Offers => res.send(Offers))
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.post('/create', verifyToken, (req, res) => {
  const listingId = req.body.listingId
  const userId = req.userId
  User.findById(userId).then(user => {
    Listing.findById(listingId).populate('offers').then(listing => {
      var date = new Date();
      date.setDate(date.getDate() + req.body.expiration);
      const newOffer = new Offer({
        quantity: req.body.quantity,
        price: req.body.price,
        coin: req.body.coin,
        USDPrice: req.body.price * 3900,
        expiration: date,
        from: user,
      })
      newOffer.save().then(savedOffer => {
        listing.offers.push(savedOffer)
        listing.save().then(savedListing => res.send(savedListing))
      })
    })
  }).catch(err => console.log(err))
});

module.exports = router;