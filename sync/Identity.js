const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Identity = require('../models/Identity');
const Token = require('../models/Token');

const {syncToken} = require('./Token');
const {syncWalletBalances} = require('./Wallet');

const syncIdentityTokens = (identity, tokens) => {
    return new Promise((resolve, reject) => {
        Token.find().then(dbTokens => {
            const newTokens = []
            const fillingTokens = new Promise((resolve, reject) => {
                tokens.forEach( token => {
                    existingToken = dbTokens.filter(dbToken => dbToken.id === token.id)
                    if (existingToken.length !== 0) {
                        newTokens.push(existingToken[0])
                    } else {
                        syncToken(token).then(savedToken => newTokens.push(savedToken)).catch(err => reject(err))
                    }
                    if (newTokens.length === tokens.length) {
                        resolve(newTokens)
                    }
                })
                if (tokens.length === 0) resolve([]);
            })
            fillingTokens.then(filledTokens => {
                identity.tokens = filledTokens;
                identity.save().then(savedIdentity => resolve(savedIdentity))
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    })
}

const syncIdentityWallet = (identity, wallet) => {
    return new Promise((resolve, reject) => {
        Wallet.findOne({ethAddress: wallet.ethAddress}).then(existingWallet => {
            if (existingWallet === null) {
                const newWallet = new Wallet({
                    ethAddress: wallet.ethAddress,
                    ethBalance: wallet.ethBalance,
                    enjBalance: wallet.enjBalance,
                    enjAllowance: wallet.enjAllowance,
                })
                newWallet.save().then(savedWallet => {
                    syncWalletBalances(wallet, savedWallet, identity.id).then(syncedWallet => {
                        identity.wallet = syncedWallet
                        identity.save().then((savedIdentity) => {
                            resolve(savedIdentity)
                        }).catch(err => reject(err))
                    })
                })
            } else {
                syncWalletBalances(wallet, existingWallet, identity.id).then(syncedWallet => {
                    identity.wallet = syncedWallet
                    identity.save().then((savedIdentity) => {
                        resolve(savedIdentity)
                    }).catch(err => reject(err))
                })
            }
        }).catch(err => reject(err))
    })
}

// const syncIdentityTransactions = (identity, transactions) => {
//   return new Promise((resolve, reject) => {
//     transactions.find().then(dbTransactions => {
//       return new Promise((resolve, reject) => {
//         const newTransactions = []
//         transactions.forEach(token => {
//           existingTransaction = dbTransactions.filter(dbTransaction => dbTransaction.id === token.id) 
//           if (existingTransaction.length !== 0) {
//             newTransactions.push(existingTransaction[0]._id)
//           } else {
//             syncToken(token).then(savedToken => newTransactions.push(savedToken._id)).catch(err => reject(err))
//           }
//           if (newTransactions.length === transactions.length) {
//             resolve(newTransactions)
//           }
//         })
//       }).then(newTransactions => {
//         identity.tokens = newTransactions;
//         identity.save().then(savedIdentity => resolve(savedIdentity))
//       }).catch(err => reject(err))
//     }).catch(err => reject(err))
//   }).catch(err => reject(err))
// }

module.exports = {syncIdentityWallet, syncIdentityTokens};