const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Identity = require('../models/Identity');
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')



// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/', (req, res) => {
  User.find().populate('identities').then(users => res.json(users))
});


// @route   POST api/users
// @desc    POST new user
// @access  Public
router.post('/register', (req, res) => {
  getAuthClient().then(client => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
    });

    const query = gql`mutation createUser {
      CreateEnjinUser(name: "${newUser.username}") {
        id
        name
        accessTokens
        identities {
          id
          linkingCode
          linkingCodeQr
        }
      }
    }
    `
    client.request(query).then(data => {
      newUser.userId = data.CreateEnjinUser.id
      data.CreateEnjinUser.identities.map(identity => {
        const newIdentity = new Identity({
          id: identity.id,
          linkingCode: identity.linkingCode,
          linkingCodeQr: identity.linkingCodeQr,
          user: newUser
        })
        newIdentity.save()
        newUser.identities.push(newIdentity)
        newUser.save()
          .then(user => {
            res.statusCode = 200;
            res.send(user);
          })
      }) 
    }).catch(err => {
      console.log('Error creating new user')
      res.statusCode = 400
      res.send({error: err})
    })
  }).catch(() => {
    console.log('Error connecting app to enjin')
    res.statusCode = 500
    res.send({message: 'Internal server error please try again later.'})
  })
});

module.exports = router;
