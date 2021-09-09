const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema ({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  creatorAddress: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  meltFeeRatio: {
    type: Number,
    required: true,
  },
  meltValue: {
    type: Number,
    required: true,
  },
  metadata: {
    type: Object,
    default: {}
  },
  metadataURI: {
    type: String,
    required: true
  },
  nonFungible: {
    type: Boolean,
    required: true
  },
  reserve: {
    type: String,
    required: true
  },
  supplyModel: {
    type: String,
    enum: ["FIXED", "SETTABLE", "INFINITE", "COLLAPSING", "ANNUAL_VALUE", "ANNUAL_PERCENTAGE"],
    required: true
  },
  circulatingSupply: {
    type: Number,
    required: true,
  },
  mintableSupply: {
    type: Number,
    required: true,
  },
  totalSupply: {
    type: Number,
    required: true,
  },
  transferable: {
    type: String,
    enum: ["PERMANENT", "TEMPORARY", "BOUND"],
    required: true
  },
  // transferFeeSettings: {
  //   type: {type: mongoose.Schema.Types.ObjectId, ref: 'TransferFeeSettings'},
  // },
  // variantMode: {
  //   type: String,
  //   enum: ["NONE", "BEAM", "ONCE", "ALWAYS"],
  //   required: true
  // },
  // variants: {
  //   type: [{type: mongoose.Schema.Types.ObjectId, ref: 'TokenVariant'}],
  //   default: []
  // }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;