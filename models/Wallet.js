const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema ({
  ethAddress: {
    type: String,
    required: true
  },
  enjAllowance: {
    type: Number,
    required: true
  },
  enjBalance: {
    type: Number,
    required: true
  },
  ethBalance: {
    type: Number,
    required: true
  },
  balances: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Balance',
    }]
  }
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;