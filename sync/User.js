const getAuthClient = require('../utils/graphQLClient')
const User = require('../models/User');
const {syncToken} = require('./Token')
const syncWallet = require('./Wallet')
const { gql } = require('graphql-request');

const syncUser = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({username: username}).populate('tokens').populate('wallet')
    .then((user) => {
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
          
          const wallet = data.EnjinUser.identities[0].wallet;
          if (wallet !== null && user.wallet === undefined) {
            syncWallet(wallet)
            .then(syncedWallet => {
              user.wallet = syncedWallet
            })
            .catch(err => reject(err))
          }

          const tokens = data.EnjinUser.identities[0].tokens;
          if (tokens !== user.tokens) {
            const tokensSynced = []
            tokens.forEach(token => {
              syncToken(token)
              .then(syncedToken => {
                tokensSynced.push(syncedToken)
                if (tokensSynced.length === tokens.length) {
                  user.tokens = tokensSynced
                  user.save({new: true}).then(syncedUser => resolve(syncedUser))
                  .catch(err => reject(err))
                };
              })
              .catch(err => reject(err))
            })
            
          }

        })
        .catch(err => reject(err))
      })
      .catch(err => reject(err))
    })
  })
}

module.exports = syncUser