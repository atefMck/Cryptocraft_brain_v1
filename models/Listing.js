const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema ({
  descriptions: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  offers: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}],
    default: [],
  },
  seller: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  },
  token: {
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'Token'},
  },
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;