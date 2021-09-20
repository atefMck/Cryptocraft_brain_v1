const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema ({
    id: {
        type: Number,
        required: true
    },
    encodedData: {
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
    type : {
        type: String,
        enum: ["ACCEPT_ASSIGNMENT", "ASSIGN", "APPROVE", "CREATE", "MINT", "SEND", "SEND_ENJ", "ADVANCED_SEND", "CREATE_TRADE", "COMPLETE_TRADE", "CANCEL_TRADE", "MELT", "UPDATE_NAME", "SET_ITEM_URI", "SET_WHITELISTED", "SET_TRANSFERABLE", "SET_MELT_FEE", "DECREASE_MAX_MELT_FEE", "SET_TRANSFER_FEE", "DECREASE_MAX_TRANSFER_FEE", "RELEASE_RESERVE", "ADD_LOG", "SET_APPROVAL_FOR_ALL", "MANAGER_UPDATE", "SET_DECIMALS", "SET_SYMBOL", "MESSAGE"],
        required: true,
    },
    userId: {
        type: Number,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ["PENDING", "BROADCAST", "TP_PROCESSING", "EXECUTED", "CANCELED_USER", "CANCELED_PLATFORM", "DROPPED", "FAILED"],
        required: true
    },
    receipt: {
        type: Object,
        required: true
    },
    events: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
        default: [],
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;