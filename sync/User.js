const getAuthClient = require('../utils/graphQLClient')
const User = require('../models/User');
const Identity = require('../models/Identity');
const {syncToken} = require('./Token')
const syncWallet = require('./Wallet')
const { gql } = require('graphql-request');

const syncUser = (user) => {
  return new Promise((resolve, reject) => {
    getAuthClient()
    .then((client) => {
      const query = gql`query getUser {
        EnjinUser(name: "${user.username}") {
          identities {
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
          }
        }
      }`
      client.request(query)
      .then(data => {
        
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))

  })
}

module.exports = syncUser