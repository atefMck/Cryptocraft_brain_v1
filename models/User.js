const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema ({
  userId: {
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
  // first_name: {
  //     type: String,
  //     required: true,
  //     trim: true
  // },
  // last_name: {
  //     type: String,
  //     required: true,
  //     trim: true
  // },
  password: {
      type: String,
      required: true,
  },
  identities: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Identity'}],
    default: []
  },
  // gender: {
  //     type: String,
  //     enum: ['Male', 'Female', 'Other', 'Unspecified'],
  //     default: 'Unspecified'
  // },
  // date_of_birth: {
  //     type: Date,
  //     required: true
  // }
});

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;