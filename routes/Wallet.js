const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const Listing = require('../models/Listing');
const { verifyToken } = require('../utils/tokenManager');


// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/getWallet', verifyToken, (req, res) => {
    const userId = req.userId
    User.findById(userId)
    .populate({path: 'identity', populate: [{path: 'wallet', populate: {path: 'balances'}}]})
    .then(user => res.send(user.identity.wallet))
    .catch(err => res.send(err))
});

module.exports = router;