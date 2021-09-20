const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trade = require('../models/Trade');
const Event = require('../models/Event');
const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');
const { verifyToken } = require('../utils/tokenManager');
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')

router.post('/createTrade/:listingId/:sellerUsername', verifyToken, async (req, res) => {
    const listingId = req.params.listingId
    const buyerId = req.userId
    const sellerUsername = req.params.sellerUsername
    
    const buyer = await User.findById(buyerId).populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]})
    const seller = await User.findOne({username: sellerUsername}).populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]})
    const listing = await Listing.findById(listingId).populate('token')
    
    getAuthClient().then(client => {
        const variables = {
            initiatorId: buyer.identity.id,
            recipientId: seller.identity.id,
            askingTokenId: listing.token.id,
            askingTokenIndex: listing.tokenIndex,
            askingValue: 1,
            offeringTokenId: "30000000000010c6",
            offeringValue: listing.price,
        }
        const query = gql`
        mutation SendTradeRequest(
            $initiatorId: Int!,
            $recipientId: Int!,
            $askingTokenId: String!,
            $askingTokenIndex: Int = 0,
            $askingValue: Float!,
            $offeringTokenId: String!,
            $offeringValue: Float!,) 
            {
                CreateEnjinRequest(
                    identityId: $initiatorId,
                    type: CREATE_TRADE,
                    create_trade_data: {
                        asking_tokens: [{id: $askingTokenId, index: $askingTokenIndex, value: $askingValue}],
                        offering_tokens: [{id:$offeringTokenId, value: $offeringValue}],
                        second_party_identity_id: $recipientId}) 
                    {
                        id
                        encodedData
                        title
                        contract
                        type
                        userId
                        value
                        state
                        receipt
                    }
                }
                `
        client.request(query, variables).then(data => {
            const newTransaction = new Transaction({
                id: data.CreateEnjinRequest.id,
                encodedData: data.CreateEnjinRequest.encodedData,
                title: data.CreateEnjinRequest.title,
                contract: data.CreateEnjinRequest.contract,
                type: data.CreateEnjinRequest.type,
                userId: data.CreateEnjinRequest.userId,
                value: data.CreateEnjinRequest.value,
                state: data.CreateEnjinRequest.state,
                receipt: data.CreateEnjinRequest.receipt,
            })
            newTransaction.save().then(async transaction => {
                try {
                    buyer.identity.transactions.push(transaction)
                    seller.identity.transactions.push(transaction)
                    const newTrade = new Trade({
                        initiator: buyer,
                        recipient: seller,
                        transaction,
                    })
                    const savedTrade = await newTrade.save()
                    buyer.identity.trades.push(savedTrade)
                    seller.identity.trades.push(savedTrade)
                    await buyer.identity.save();
                    await seller.identity.save();
                    res.send(savedTrade)
                } catch (err) {
                    console.log(err)
                    res.send(err)
                }
            })
        }).catch(err => console.log(err))
    })
});

router.post('/initiatorConfirm/:tradeId', verifyToken, (req, res) => {
    const tradeId = req.params.tradeId
    Trade.findById(tradeId)
    .populate('initiator')
    .populate('recipient')
    .populate('transaction')
    .then(trade => {
        getAuthClient().then(client => {
            console.log()
            const variables = {
                id: trade.transaction.id
            }
            const query = gql`
            query RetrieveTradeId($id: Int!) {
                EnjinTransactions(id: $id) {
                  type
                  transactionId
                  events {
                    id
                    tokenId
                    event
                    param1
                    param2
                    param3
                    param4
                    blockNumber
                  }
                }
              }
            `
            client.request(query, variables).then(data => {
                const newEvent = new Event({
                    id: data.EnjinTransactions[0].events[0].id,
                    transactionId: data.EnjinTransactions[0].transactionId,
                    event: data.EnjinTransactions[0].events[0].event,
                    param1: data.EnjinTransactions[0].events[0].param1,
                    param2: data.EnjinTransactions[0].events[0].param2,
                    param3: data.EnjinTransactions[0].events[0].param3,
                    param4: data.EnjinTransactions[0].events[0].param4,
                    blockNumber: data.EnjinTransactions[0].events[0].blockNumber,
                })
                newEvent.save().then(event => {
                    trade.transaction.events.push(event);
                    trade.transaction.save().then(() => {
                        trade.param1 = event.param1
                        trade.save().then(savedTrade => {
                            res.send(savedTrade)
                        })
                    })
                })
            })
        })
    })
})

router.post('/recipientConfirm/:tradeId', verifyToken, (req, res) => {
    const tradeId = req.params.tradeId
    Trade.findById(tradeId)
    .populate('initiator')
    .populate({path: 'recipient', populate: {path: 'identity'}})
    .populate('transaction')
    .then(trade => {
        getAuthClient().then(client => {
            const variables = {
                id: trade.recipient.identity.id,
                tradeId: trade.param1
            }
            const query = gql`
            mutation CompleteTradeRequest($id: Int!, $tradeId: String!) {
                CreateEnjinRequest(
                 identityId: $id,
                 type: COMPLETE_TRADE,
                 complete_trade_data: {
                   trade_id: $tradeId
                }
               ) {
                    id
                    encodedData
                    title
                    contract
                    type
                    userId
                    value
                    state
                    receipt
                }
               }
            `
            client.request(query, variables).then(data => {
                trade.transaction.encodedData = data.CreateEnjinRequest.encodedData
                trade.transaction.title = data.CreateEnjinRequest.title
                trade.transaction.contract = data.CreateEnjinRequest.contract
                trade.transaction.type = data.CreateEnjinRequest.type
                trade.transaction.userId = data.CreateEnjinRequest.userId
                trade.transaction.value = data.CreateEnjinRequest.value
                trade.transaction.state = data.CreateEnjinRequest.state
                trade.transaction.receipt = data.CreateEnjinRequest.receipt
                trade.transaction.save().then(updatedTransaction => {
                    res.send(updatedTransaction);
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        })
    })
})

module.exports = router;