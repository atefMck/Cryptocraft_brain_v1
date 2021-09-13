const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema ({
  id: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
      type: String,
      required: true,
  },
  linkingCode: {
    type: String,
    required: true
  },
  linkingCodeQr: {
    type: String,
    required: true
  },
  transactions: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
    default: []
  },
  tokens: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Token'}],
    default: []
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  listings: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}],
    default: []
  }
});

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;