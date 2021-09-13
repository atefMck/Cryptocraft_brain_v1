const express = require('express');
const router = express.Router();
const User = require('../models/User');
const getAuthClient = require('../utils/graphQLClient')
const {verifyToken} = require('../utils/tokenManager');
const { gql } = require('graphql-request')

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/checkLinking', verifyToken, (req, res) => {
  const id = req.userId
  console.log(id)
  User.findById(id).populate('wallet').then(user => {
    getAuthClient(client => {
      console.log(user.username)
      const query = gql`query getUser {
        EnjinUser(name: "${user.username}") {
          identities {
            wallet {
              ethAddress
            }
          }
        }
      }
      `
      client.request(query).then(data => {
        console.log(data)
        res.send(data)
      }).catch(err => res.send(err))
    })
  })
});

module.exports = router;