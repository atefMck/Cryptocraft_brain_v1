const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransferFeeSettingsSchema = new Schema ({
  AssetTransferFeeType : {
    type: String,
    enum: ['NONE', 'PER_TRANSFER', 'PER_CRYPTO_ITEM', 'RATIO_CUT', 'RATIO_EXTRA'],
    required: true
  },
  assetId: {
    type: String,
    required: true,
  },
  variantMetadata: {
    type: Object,
    required: true,
  },
  flags: {
    type: Number,
    required: true,
  }
});

const TransferFeeSettings = mongoose.model('TransferFeeSettings', TransferFeeSettingsSchema);

module.exports = TransferFeeSettings;