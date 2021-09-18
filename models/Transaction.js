const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema ({
  from: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    required: true,
  },
  to: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    required: true,
  },
  transactionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  contract: {
    type: String,
    required: true
  },
  transactionType : {
    type: String,
    enum: ["ACCEPT_ASSIGNMENT", "ASSIGN", "APPROVE", "CREATE", "MINT", "SEND", "SEND_ENJ", "ADVANCED_SEND", "CREATE_TRADE", "COMPLETE_TRADE", "CANCEL_TRADE", "MELT", "UPDATE_NAME", "SET_ITEM_URI", "SET_WHITELISTED", "SET_TRANSFERABLE", "SET_MELT_FEE", "DECREASE_MAX_MELT_FEE", "SET_TRANSFER_FEE", "DECREASE_MAX_TRANSFER_FEE", "RELEASE_RESERVE", "ADD_LOG", "SET_APPROVAL_FOR_ALL", "MANAGER_UPDATE", "SET_DECIMALS", "SET_SYMBOL", "MESSAGE"],
    required: true,
  },
  icon: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ["PENDING", "BROADCAST", "TP_PROCESSING", "EXECUTED", "CANCELED_USER", "CANCELED_PLATFORM", "DROPPED", "FAILED"],
    default: "PENDING"
  },
  token: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Token'},
    required: true
  },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;