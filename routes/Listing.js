const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/', (req, res) => {
  Listing.find()
      .then(listings => res.json(listings))
});

module.exports = router;