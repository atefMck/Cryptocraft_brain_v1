const getAuthClient = require('../utils/graphQLClient')
const Token = require('../models/Token');
const { gql } = require('graphql-request');

const syncToken = (token) => {
  return new Promise((resolve, reject) => {
    const URI = token.metadataURI ? token.metadataURI : "placeholder"
    const newToken = new Token({
      id: token.id,
      name: token.name,
      creatorAddress: token.creator,
      icon: token.icon,
      meltFeeRatio: token.meltFeeRatio,
      meltValue: token.meltValue,
      metadata: token.metadata,
      metadataURI: URI,
      reserve: token.reserve,
      nonFungible: token.nonFungible,
      supplyModel: token.supplyModel,
      circulatingSupply: token.circulatingSupply,
      mintableSupply: token.mintableSupply,
      totalSupply: token.totalSupply,
      transferable: token.transferable,
    })
    newToken.save()
    .then(savedToken => resolve(savedToken))
    .catch(err => {
      if (err.code !== 11000) reject(err);
      else {
        Token.findOne({id: token.id}).then(savedToken => resolve(savedToken))
      }
    })
  })
}

const syncTokens = () => {
  return new Promise((resolve, reject) => {
    getAuthClient()
    .then((client) => {
      const query = gql`query getAppTokens {
        EnjinApp {
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
      }`
      client.request(query)
      .then(data => {
        const tokens = data.EnjinApp.tokens;
        const tokensSynced = []
        tokens.forEach(token => {
          syncToken(token)
          .then(savedToken => {
            tokensSynced.push(savedToken)
            if (tokensSynced.length === tokens.length) resolve(tokensSynced);
          })
          .catch(err => reject(err))
        })
      })
      .catch(err => reject(err))
    })
    .catch(err => reject(err))
  })
}

module.exports = {syncTokens, syncToken}