const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema ({
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  USDPrice: {
    type: Number,
    required: true
  },
  coin: {
    type: String,
    required: true
  },
  expiration: {
    type: Date,
    require: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
});

const Offer = mongoose.model('Offer', OfferSchema);

module.exports = Offer;