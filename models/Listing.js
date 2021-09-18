const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema ({
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  offers: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}],
    default: [],
  },
  tokenIndex: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
  },
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;