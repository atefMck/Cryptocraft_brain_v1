const express = require('express');
const router = express.Router();
const {syncTokens} = require('../sync/Token')
const Token = require('../models/Token');
const { gql } = require('graphql-request');
const {verifyToken} = require('../utils/tokenManager');


router.get('/:tokenId', (req, res) => {
  Token.findById(req.params.tokenId).then(token => {
    token.views += 1
    token.save().then(savedToken => res.send(savedToken))
  })
});

// @route   GET api/Tokens
// @desc    GET all Tokens
// @access  Public
router.get('/syncTokens', verifyToken, (req, res) => {
  syncTokens().then(tokens => res.send(tokens)).catch(err => console.log(err))
});



    

module.exports = router;