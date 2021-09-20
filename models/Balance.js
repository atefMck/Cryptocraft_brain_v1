const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceSchema = new Schema ({
  tokenIndex: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
  },
  identityId: {
    type: String,
    required: true
  },
});

const Balance = mongoose.model('Balance', BalanceSchema);

module.exports = Balance;