const getAuthClient = require('../utils/graphQLClient')
const User = require('../models/User');
const {syncIdentityWallet, syncIdentityTokens} = require('../sync/Identity')
const { gql } = require('graphql-request');

require('dotenv').config();
const {ENJIN_PROJECT_ID} = process.env

const syncUser = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({username})
        .populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]})
        .populate({path: 'listings', populate: {path: 'token'}})
        .exec((err, user) => {
            if (err) {
                console.log(err)
                reject({message: 'Internal server error please try again later.'});
            } 
            else {
                getAuthClient().then(client => {
                    const query = gql `query getTokens {
                        EnjinIdentity(id: ${user.identity.id}) {
                            wallet {
                                ethAddress
                                ethBalance
                                enjBalance
                                enjAllowance
                                balances(appId: ${ENJIN_PROJECT_ID}) {
                                    id
                                    index
                                    token {
                                        id
                                    }
                                    value
                                }
                            }
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
                        const wallet = data.EnjinIdentity.wallet
                        syncIdentityWallet(user.identity, wallet).then(syncedIdentity => {
                            syncIdentityTokens(syncedIdentity, tokens).then(linkedIdentity => resolve(linkedIdentity))
                        })
                    })
                })
            }
        })
        
    })
}

module.exports = syncUser