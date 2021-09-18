const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {verifyToken} = require('../utils/tokenManager');

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/getUserId', verifyToken, (req, res) => {
  res.send({userId: req.userId, username: req.username})
});

module.exports = router;