const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const { verifyToken } = require('../utils/tokenManager');
const getAuthClient = require('../utils/graphQLClient')
const { gql } = require('graphql-request')

router.post('/sendTokenNFT/:listingId/:sellerUsername', verifyToken, async (req, res) => {
  const listingId = req.params.listingId
  const buyerId = req.userId
  const sellerUsername = req.params.sellerUsername
  
  const buyer = await User.findById(buyerId).populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]})
  const seller = await User.findOne({username: sellerUsername}).populate({path: 'identity', populate: [{path: 'tokens'}, {path: 'wallet', populate: {path: 'balances'}}]})
  const listing = await Listing.findById(listingId).populate('token')

  getAuthClient().then(client => {
    const query = gql`mutation sendToken {
      CreateEnjinRequest(
        identityId: ${seller.identity.id}
        type: SEND
        send_token_data: {
          token_id: "${listing.token.id}"
          token_index: "${listing.tokenIndex}"
          recipient_identity_id: ${buyer.identity.id}
          value: 1
        }) {
        id
        encodedData
        transactionId
      }
    }
    `
    client.request(query).then( async data => {
      try {
        const buyerBalances = buyer.identity.wallet.balances
        let sellerBalances = seller.identity.wallet.balances
        const buyerTokens = buyer.identity.tokens
        let sellerTokens = seller.identity.tokens
        const soldToken = listing.token
        const exchangedBalance = sellerBalances.filter(balance => (balance.tokenIndex === listing.tokenIndex) && (balance.tokenId === listing.token.id))[0]
        buyerBalances.push(exchangedBalance)
        sellerBalances = [...sellerBalances.filter(balance => !((balance.tokenIndex === listing.tokenIndex) && (balance.tokenId === listing.token.id)))]
        buyerTokens.push(soldToken)
        if (sellerBalances.filter(balance => balance.tokenId === soldToken.id).length === 0) {
          sellerTokens = [...sellerTokens.filter(token => token.id !== soldToken.id)]
        }
        await buyer.identity.wallet.save()
        await seller.identity.wallet.save()
        await buyer.identity.save()
        await seller.identity.save()
        await listing.remove()
        res.send({message: 'Successfully purchase'})
      } catch (err) {
        console.log(err)
        res.send(err)
      }
    }).catch(err => res.send(err))
  })
});

module.exports = router;