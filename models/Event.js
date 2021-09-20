const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema ({
    id: {
        type: Number,
        required: true
    },
    event: {
        type: String,
        enum: ["UNKNOWN_EVENT", "CREATE", "MELT", "MINT", "LOG", "APPROVAL", "APPROVAL_FOR_ALL", "TRANSFER", "TRANSFER_SINGLE", "TRANSFER_BATCH", "UPDATE_TRANSFER_FEE", "UPDATE_MAX_TRANSFER_FEE", "UPDATE_MELT_FEE", "UPDATE_MAX_MELT_FEE", "UPDATE_TRANSFERABLE", "ASSIGN", "ACCEPT_ASSIGNMENT", "WHITELIST", "CREATE_TRADE", "COMPLETE_TRADE", "CANCEL_TRADE", "URI", "NAME", "INITIALIZE", "RETIRE", "DECIMALS", "SYMBOL", "DEPLOY_ERC_ADAPTER", "MANAGER_UPDATE"],
        required: true
    },
    param1: {
        type: String
    },
    param2: {
        type: String
    },
    param3: {
        type: String
    },
    param4: {
        type: String
    },
    blockNumber: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: Number,
        required: true,
    }
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;