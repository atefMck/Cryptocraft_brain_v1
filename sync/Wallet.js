
const Wallet = require('../models/Wallet');

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

module.exports = syncWallet