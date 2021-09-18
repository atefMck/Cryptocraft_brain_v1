
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

const syncWalletBalances = (wallet, dbWallet) => {
  return new Promise((resolve, reject) => {
    const balances = wallet.balances
    const newBalances = []
    if (balances.length > 0) {
      Balance.find().then(dbBalances => {
        return new Promise((resolve, reject) => {
          balances.forEach(balance => {
            existingBalance = [...dbBalances.filter(dbBalance => (dbBalance.tokenId === balance.id) && (dbBalance.tokenIndex === balance.index))]
            if (existingBalance.length !== 0) {
              if (existingBalance[0].value !== balance.value) {
                existingBalance[0].value = balance.value
                existingBalance[0].save().then(updatedBalance => newBalances.push(updatedBalance._id))
              } else {
                newBalances.push(existingBalance[0]._id)
              }
            } else {
              const newBalance = new Balance({
                tokenId: balance.id,
                tokenIndex: balance.index,
                value: balance.value,
              })
              newBalance.save().then(savedBalance => {newBalances.push(savedBalance._id)}).catch(err => reject(err))
            }
            if (newBalances.length === balances.length) {
              console.log(newBalances) 
              resolve(newBalances)
            }
          })
          console.log(newBalances) 
          resolve(newBalances)
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