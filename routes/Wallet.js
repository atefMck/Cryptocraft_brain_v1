const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { verifyToken } = require('../utils/tokenManager');


// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/', (req, res) => {
  Wallet.find().populate('balances').then(wallets => res.send(wallets))
});

module.exports = router;