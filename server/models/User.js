const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
  },

  password: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  cv: {},
});

module.exports = model('User', UserSchema);
