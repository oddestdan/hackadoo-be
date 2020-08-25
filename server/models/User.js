const {Schema, model, Types} = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
  },
  googleId: {type: String},
  password: {type: String},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  profilePicture: {type: String, default: null},
  s3Key: {type: String, default: null},

  cv: {},
});

UserSchema.pre('save', function(next) {
  const User = this;

  // only hash the password if it has been modified (or is new)
  if (User.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(User.password, salt, function(err, hash) {
        if (err) return next(err);

        User.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

module.exports = model('User', UserSchema);
