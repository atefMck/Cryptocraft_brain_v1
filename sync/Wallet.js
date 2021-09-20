
const Wallet = require('../models/Wallet');
const Balance = require('../models/Balance');

const syncWallet = (wallet) => {
  return new Promise((resolve, reject) => {
    const newWallet = new Wallet({
      ethAddress: wallet.ethAddress,
      enjAllowance: wallet.enjAllowance,
      enjBalance: wallet.enjBalance,
      ethBalance: wallet.ethBalance,
    })
    newWallet.save({new: true})
    .then(savedWallet => resolve(savedWallet))
    .catch(err => reject(err))
  })
}

const syncWalletBalances = (wallet, dbWallet, identityId) => {
  return new Promise((resolve, reject) => {
    const balances = wallet.balances
    const newBalances = []
    if (balances.length > 0) {
      Balance.find().then(dbBalances => {
        return new Promise((resolve, reject) => {
          balances.forEach( async balance => {
            existingBalance = dbBalances.filter(dbBalance => (dbBalance.tokenId === balance.id) && (dbBalance.tokenIndex === balance.index) && (dbBalance.identityId === identityId.toString()))
            if (existingBalance.length !== 0) {
                newBalances.push(existingBalance[0])
            } else {
              const newBalance = new Balance({
                tokenId: balance.id,
                tokenIndex: balance.index,
                value: balance.value,
                identityId: identityId,
              })
              const savedBalance = await newBalance.save()
              newBalances.push(savedBalance);
            }
            if (newBalances.length === balances.length) {
              resolve(newBalances)
            }
            if (balances.length === 0) resolve([]);
          })
        }).then(newBalances => {
          dbWallet.balances = newBalances;
          dbWallet.save().then(savedWallet => resolve(savedWallet)).catch(err => reject(err))
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    } else {
      resolve(dbWallet)
    }
  })
}

module.exports = {syncWallet, syncWalletBalances}