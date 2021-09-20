const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Identity = require('../models/Identity');

const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')
const bcrypt = require('bcrypt')
const {generateToken, verifyToken} = require('../utils/tokenManager');
const {syncIdentityWallet, syncIdentityTokens} = require('../sync/Identity')
const syncUser = require('../sync/User')

require('dotenv').config();
const {ENJIN_PROJECT_ID} = process.env


router.get('/', verifyToken, (req, res) => {
  User.find().populate('wallet').exec((err, users) => {res.send(users)})
});

// @route   GET api/users
// @desc    GET all users
// @access  Public
router.get('/getProfile/:username', (req, res) => {
  const username = req.params.username
  User.findOne({username}).populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]}).populate({path: 'listings', populate: {path: 'token'}})
  .exec((err, user) => {
    if (err) {
      res.statusCode = 500
      res.send({message: 'Internal server error please try again later.'});
    } else {
      res.json(user)
    };
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
      const user = data.CreateEnjinUser
      const identity = user.identities[0]
      const newIdentity = new Identity({
        id: identity.id,
        linkingCode: identity.linkingCode,
        linkingCodeQr: identity.linkingCodeQr,
      })
      newIdentity.save(() => {
        const newUser = new User({
          id: user.id,
          username: req.body.username,
          email: req.body.email.toLowerCase(),
          password: req.body.password,
          identity: newIdentity
        });
        newUser.save()
        .then(user => {
          res.statusCode = 201;
          res.send(user);
        })
        .catch(err => {
          console.log('Error creating new user')
          res.statusCode = 400
          res.send({error: err})
        })
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
  const username = req.body.username || req.body.filter(data => data.name === 'username')[0].value;
  const password = req.body.password || req.body.filter(data => data.name === 'password')[0].value;
  User.findOne({username: username}).select('+password')
  .then((user) => {
    bcrypt.compare(password, user.password, (err, correct) => {
      if (err) {
        res.statusCode = 500
        res.send({message: 'Internal server error please try again later.'});
      } else {
        if (correct) {
          generateToken({userId: user._id, username: user.username})
          .then(token => {
            user.password = 'Obfuscated'
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
router.get('/syncUser', verifyToken, (req, res) => {
  const id = req.userId
  User.findById(id).populate('identity')
  .exec((err, user) => {
    if (err) {
      res.statusCode = 500
      console.log(err)
      res.send({message: 'Internal server error please try again later.'});
    } 
    else {
      getAuthClient().then(client => {
        const query = gql `query getTokens {
          EnjinIdentity(id: ${user.identity.id}) {
            wallet {
              ethAddress
              ethBalance
              enjBalance
              enjAllowance
              balances(appId: ${ENJIN_PROJECT_ID}) {
                id
                index
                token {
                  id
                }
                value
              }
            }
            tokens {
              id
              name
              creator
              icon
              meltFeeRatio
              meltValue
              metadata
              reserve
              nonFungible
              supplyModel
              circulatingSupply
              mintableSupply
              totalSupply
              transferable
            }
          }
        }
        `
        client.request(query).then(data => {
          const tokens = data.EnjinIdentity.tokens
          const wallet = data.EnjinIdentity.wallet
          syncIdentityWallet(user.identity, wallet).then(syncedIdentity => {
            syncIdentityTokens(syncedIdentity, tokens).then(linkedIdentity => res.send(linkedIdentity))
          })
        })
      })
    }
  })
})

router.get('/syncUserr/:username', (req, res) => {
    const username = req.params.username
    syncUser(username).then(identity => res.send(identity)).catch(err => res.send(err))
  });

module.exports = router;