const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransferFeeSettingsSchema = new Schema ({
  assetTransferFeeType : {
    type: String,
    enum: ['NONE', 'PER_TRANSFER', 'PER_CRYPTO_ITEM', 'RATIO_CUT', 'RATIO_EXTRA'],
    required: true
  },
  assetId: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
});

const TransferFeeSettings = mongoose.model('TransferFeeSettings', TransferFeeSettingsSchema);

module.exports = TransferFeeSettings;