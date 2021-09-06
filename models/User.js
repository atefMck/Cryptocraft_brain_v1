const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
  id: {
    type: Number,
    default: 0
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
  identities: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Identities'}],
    default: []
  },
  gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
  },
  date_of_birth: {
      type: Date,
      required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;