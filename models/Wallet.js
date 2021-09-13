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
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;