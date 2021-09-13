const express = require('express');
const router = express.Router();
const User = require('../models/User');
const syncUser = require('../sync/User')
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')
const bcrypt = require('bcrypt')
const {generateToken, verifyToken} = require('../utils/tokenManager');


router.get('/', verifyToken, (req, res) => {
  User.find().populate('wallet').exec((err, users) => {res.send(users)})
});

// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/getProfile/:username', (req, res) => {
  const username = req.params.username
  User.findOne({username}).populate('wallet').populate('tokens').populate({path: 'listings', populate: {path: 'token', ref: 'Token'}})
    .exec((err, user) => {
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
    const query = gql`mutation createUser {
      CreateEnjinUser(name: "${req.body.username}") {
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
      const identity = data.CreateEnjinUser.identities[0]
      const newUser = new User({
        id: data.CreateEnjinUser.identities[0].id,
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        linkingCode: identity.linkingCode,
        linkingCodeQr: identity.linkingCodeQr,
      });
      newUser.save()
        .then(user => {
          user.password = '###############################################'
          res.statusCode = 200;
          res.send(user);
        })
        .catch(err => {
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
});

// @route   POST api/users
// @desc    POST new user
// @access  Public
router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username})
    .then((user) => {
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
    }).catch(() => {
      res.statusCode = 500
      res.send({message: 'The username you entered doesn\'t match any account'})
    })
});

// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/syncData', verifyToken, (req, res) => {
  const id = req.userId
  User.findById(id).populate('wallet').populate('tokens')
    .exec((err, user) => {
      if (err) {
        res.statusCode = 500
        console.log(err)
        res.send({message: 'Internal server error please try again later.'});
      } else {
        syncUser(user.username).then(syncedUser => res.send(syncedUser)).catch(err => console.log(err))
      };
    })
});

module.exports = router;