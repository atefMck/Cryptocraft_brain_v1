const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdentitySchema = new Schema ({
  id: {
    type: Number,
    default: 0
  },
  appId: {
    type: Number,
    default: 5060
  },
  linkingCode: {
    type: String
  },
  linkingQrCode: {
    type: String
  },
  user: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    required: true,
  },
  transactions: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
    default: []
  },
  tokens: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Token'}],
    default: []
  },
  wallet: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'},
  }
});

const Identity = mongoose.model('Identity', IdentitySchema);

module.exports = Identity;