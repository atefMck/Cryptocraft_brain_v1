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
  profileInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileInfo'
  },
  identity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Identity',
  },
  listings: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    }]
  }
});

UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;