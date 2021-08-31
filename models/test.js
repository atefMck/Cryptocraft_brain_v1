const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  first_name: {
      type: String,
      required: true,
      trim: true
  },
  last_name: {
      type: String,
      required: true,
      trim: true
  },
  password: {
      type: String,
      required: true,
  },
  gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
  },
  date_of_birth: {
      type: Date,
      required: true
  },
  address: {
      type: String,
      required: true
  },
  phone: {
      type: Number,
      required: true
  },
  date_of_creation: {
      type: Date,
      default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;