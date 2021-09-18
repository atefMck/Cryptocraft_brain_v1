const express = require('express');
const router = express.Router();
const {syncTokens} = require('../sync/Token')
const Token = require('../models/Token');
const {verifyToken} = require('../utils/tokenManager');


router.get('/:tokenId', (req, res) => {
  Token.findById(req.params.tokenId).then(token => {
    token.views += 1
    token.save().then(savedToken => res.send(savedToken))
  })
});

module.exports = router;