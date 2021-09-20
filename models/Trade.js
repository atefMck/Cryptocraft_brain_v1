const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema ({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    },
    param1: {
        type: String,
    },
});

const Trade = mongoose.model('Trade', TradeSchema);

module.exports = Trade;