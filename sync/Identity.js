const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Identity = require('../models/Identity');
const Token = require('../models/Token');

const {syncToken} = require('./Token');

const createIdentity = (userId) => {
  return new Promise((resolve, reject) => {
    getAuthClient().then(client => {
      const query = gql `mutation CreateIdentity {
        CreateEnjinIdentity(userId: ${userId}) {
          id
          linkingCode
          linkingCodeQr
        }
      }
      `
      client.request(query).then(data => {
        User.findOne({id: userId}).then(user => {
          const identity = data.CreateIdentity;
          const newIdentity = new Identity({
            id: identity.id,
            linkingCode: identity.linkingCode,
            linkingCodeQr: identity.linkingCodeQr,
            wallet: savedWallet,
          })
          newIdentity.save().then(savedIdentity => {
            user.identities.push(savedIdentity._id)
            user.save().then(() => {
              resolve(savedIdentity)
            }).catch(err => reject(err))
          }).catch(err => reject(err))
        }).catch(err => reject(err))
      }).catch(err => {
        // if (err.response.status === 409)
      })
    }).catch(err => reject(err))
  })
}

const linkIdentity = (identity) => {
  return new Promise((resolve, reject) => {
    getAuthClient().then(client => {
      const query = gql `query getTokens {
        EnjinIdentity(id: ${identity.id}) {
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

        Token.find().then(dbTokens => {
          return new Promise((resolve, reject) => {
            const newTokens = []
            tokens.forEach(token => {
              existingToken = dbTokens.filter(dbToken => dbToken.id === token.id) 
              if (existingToken.length !== 0) {
                newTokens.push(existingToken[0]._id)
              } else {
                syncToken(token).then(savedToken => newTokens.push(savedToken._id)).catch(err => reject(err))
              }
            })
            resolve(newTokens)
          }).then(newTokens => {
            identity.tokens = newTokens;
            identity.save().then(savedIdentity => resolve(savedIdentity))
          }).catch(err => reject(err))
        }).catch(err => reject(err))

      }).catch(err => reject(err))
    }).catch(err => reject(err))
  })
}

const syncIdentity = (identity) => {
  return new Promise((resolve, reject) => {
    getAuthClient().then(client => {
      const query = gql `query GetEnjinIdentity {
        EnjinIdentity(id: ${identity.id}) {
          wallet {
            ethAddress
            ethBalance
            enjBalance
            enjAllowance
          }
        }
      }
      `
      client.request(query).then(data => {
        const wallet = data.EnjinIdentity.wallet;
        const newWallet = new Wallet({
          ethAddress: wallet.ethAddress,
          ethBalance: wallet.ethBalance,
          enjBalance: wallet.enjBalance,
          enjAllowance: wallet.enjAllowance,
        })
        newWallet.save().then(savedWallet => {
          identity.wallet = savedWallet
          identity.save().then((savedIdentity) => {
            resolve(savedIdentity)
          }).catch(err => reject(err))
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    }).catch(err => reject(err))
  })
}

module.exports = {createIdentity, syncIdentity, linkIdentity};