const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdentitySchema = new Schema ({
  id: {
    type: Number,
    required: true
  },
  linkingCode: {
    type: String,
    required: true
  },
  linkingCodeQr: {
    type: String,
    required: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  transactions: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
    default: [],
  },
  tokens: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Token'}],
    default: [],
  },
});

const Identity = mongoose.model('Identity', IdentitySchema);

module.exports = Identity;