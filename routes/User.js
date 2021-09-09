const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Identity = require('../models/Identity');
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')
const bcrypt = require('bcrypt')
const {generateToken, verifyToken} = require('../utils/tokenManager');



// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/getProfile', verifyToken, (req, res) => {
  const id = req.userId
  User.findById(id).populate({
    path: 'identities', 
    populate: [
      {path: 'tokens'},
      {path: 'wallet'}
    ]
  })
    .exec((err, user) => {
      console.log(err)
      if (err) {
        res.statusCode = 500
        res.send({message: 'Internal server error please try again later.'});
      } else res.json(user);
    })
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
        })
        newIdentity.save()
        newUser.identities.push(newIdentity)
        newUser.save()
          .then(user => {
            user.password = '###############################################'
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

// @route   POST api/users
// @desc    POST new user
// @access  Public
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username})
      .populate('identities')
      .populate('identities.tokens')
      .populate('identities.transactions')
      .exec((err, user) => {
      if (err || user === null) {
        res.statusCode = 400
        res.send({message: 'The username you entred isn\'t connected to an account.'});
      } else {
        bcrypt.compare(password, user.password, (err, correct) => {
          if (err) {
            res.statusCode = 500
            res.send({message: 'Internal server error please try again later.'});
          } else {
            if (correct) {
              user.password = '######################Cryptocraft######################'
              generateToken(user._id)
                .then(token => {
                  res.statusCode = 200
                  res.send({user, token})
                })
            } else {
              res.statusCode = 400
              res.send({message: 'The password you entered is incorrect.'})
            }
          }
        })
      }
    })  
});

module.exports = router;