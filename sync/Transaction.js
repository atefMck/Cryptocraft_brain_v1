const Transaction = require('../models/Transaction');

const syncTransaction = (transaction) => {
  return new Promise((resolve, reject) => {
    const newTransaction = new Transaction({
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

module.exports = {syncTransaction}