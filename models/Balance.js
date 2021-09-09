const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceSchema = new Schema ({
  token: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Token'},
    required: true
  },
  value: {
    type: Number,
    required: true,
  }
});

const Balance = mongoose.model('Balance', BalanceSchema);

module.exports = Balance;