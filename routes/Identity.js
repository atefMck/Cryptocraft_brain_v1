const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Identity = require('../models/Identity');
const Token = require('../models/Token');
const {verifyToken} = require('../utils/tokenManager');
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')

router.get('/', verifyToken, (req, res) => {
  Identity.find().populate('wallet').populate('tokens').then(identities => {res.send(identities)})
});

// @route   GET api/listings
// @desc    GET all listings
// @access  Public
router.get('/checkLinking', verifyToken, (req, res) => {
  const id = req.userId;
  User.findById(id).populate('identities').exec((err, user) => {
    if (err) {
      res.statusCode = 500
      res.send({message: 'Internal server error please try again later.'});
    } else {
      getAuthClient().then(client => {
        const query = gql`query getUser {
          EnjinOauth(name:"${user.username}") {
            id
            identities {
              id
              wallet {
                ethAddress
                enjAllowance
                enjBalance
                ethBalance
              }
              tokens {
                id
                name
                creator
                icon
                meltFeeRatio
                meltValue
                metadata
                metadataURI
                reserve
                nonFungible
                supplyModel
                circulatingSupply
                mintableSupply
                totalSupply
                transferable
              }
              linkingCode
              linkingCodeQr
            }
          }
        }
        `
        const response = {
          code: 500,
          linked: false,
          syncIdentity: false,
          syncTokens: false,
          message: ''
        }

        client.request(query).then(data => {
          if (data.EnjinOauth.identities[0].wallet !== null) {
            Identity.findOne({id: data.EnjinOauth.identities[0].id}).populate('wallet').then(identity=> {
              if (identity.wallet === undefined) {
                const newWallet = new Wallet({
                  ethAddress: data.EnjinOauth.identities[0].wallet.ethAddress,
                  enjAllowance: data.EnjinOauth.identities[0].wallet.enjAllowance,
                  enjBalance: data.EnjinOauth.identities[0].wallet.enjBalance,
                  ethBalance: data.EnjinOauth.identities[0].wallet.ethBalance
                })
                newWallet.save().then(wallet => {
                  identity.wallet = wallet
                  identity.save().then(() => {
                    response.code = 200
                    response.linked = true,
                    response.syncIdentity = true
                  })
                })
              } else {
                response.code = 200
                response.linked = true,
                response.syncIdentity = false
              }
            })
          } else {
            res.statusCode = 400
            response.message = 'Wallet haven\'t been linked properly, please carefully redo the previous process'
            response.code = 400
            response.linked = false,
            response.syncIdentity = false
          }

          if (data.EnjinOauth.identities[0].tokens.length > 0) {
            Identity.findOne({id: data.EnjinOauth.identities[0].id}).populate('tokens').then(identity=> {
              if (identity.tokens !== data.EnjinOauth.identities[0].tokens.length) {
                data.EnjinOauth.identities[0].tokens.forEach(token => {
                  const newToken = new Token({
                    id: token.id,
                    name: token.name,
                    creatorAddress: token.creator,
                    image: token.icon,
                    meltFeeRatio: token.meltFeeRatio,
                    meltValue: token.meltValue,
                    metadata: token.metadata,
                    metadataURI: "token.metadataURI === null ? token.metadataURI : 'hello'",
                    reserve: token.reserve,
                    nonFungible: token.nonFungible,
                    supplyModel: token.supplyModel,
                    circulatingSupply: token.circulatingSupply,
                    mintableSupply: token.mintableSupply,
                    totalSupply: token.totalSupply,
                    transferable: token.transferable,
                  })
                  newToken.save().then(token => {
                    identity.tokens.push(token)
                    identity.save()
                  })
                })
                response.code = 200
                response.linked = true
                response.syncToken = true
              } else {
                response.code = 200
                response.linked = true
                response.syncToken = false
              }
            })
          }
          res.statusCode = response.code
          res.send({
            linked: false,
            syncIdentity: false,
            syncTokens: false,
            message: ''
          })
        })
      })
    };
  })
});

module.exports = router;