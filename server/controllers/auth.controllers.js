const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const errorHandler = require('../utils/errorHandler');
const googleVerify = require('../utils/googleVerify');

const config = require('config');
const {secret} = config.get('JWT');

getToken = (user) => {
  const token = jwt.sign({
    userId: user.id
  }, secret);
  return token;
};

module.exports.login = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        status: 'User has not been found',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'Password incorrect',
      });
    }

    const token = getToken(user);

    const userInfo = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      tests: user.tests,
    }

    res.status(200).json({
      status: 'User authenticated successfully',
      token: `Bearer ${token}`,
      user: userInfo
    });
  } catch (e) {
    errorHandler(res, 500, e);
  }
};

module.exports.googleLogin = async (req, res) => {

  try {
    // const payload = await googleVerify(req.body.id_token);
    const payload = req.body.payload;

    const user = await User.findOne({
      googleId: payload.sub
    });

    if (user) {
      const token = getToken(user);
      const userInfo = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        cv: user.cv,
      };

      return res.status(200).json({
        status: 'User authenticated successfully',
        token: `Bearer ${token}`,
        user: userInfo,
      });
    }

    const candidate = await User.findOne({
      email: payload.email
    });

    if (candidate) {
      const profilePicture = candidate.profilePicture ?
        candidate.profilePicture :
        payload.picture;

      await candidate.update({
        googleId: payload.sub,
        profilePicture
      });
      const newUser = await candidate.save();

      const userInfo = {
        userId: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        tests: newUser.tests,
      }
      const token = getToken(candidate);
      return res.status(200).json({
        status: 'User authenticated successfully',
        token: `Bearer ${token}`,
        user: userInfo,
      });
    }

    const userInfo = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      profilePicture: payload.picture,
      tests: [],
    }

    const newUser = new User({
      googleId: payload.sub,
      ...userInfo
    });

    const savedUser = await newUser.save();

    const token = getToken(savedUser);
    res.status(200).json({
      status: 'User authenticated successfully',
      token: `Bearer ${token}`,
      user:
      {
        userId: savedUser._id,
        ...userInfo
      },
    });
  } catch (e) {
    errorHandler(res, 500, e);
  }
};

module.exports.register = async (req, res) => {
  try {
    const {
      password,
      firstName,
      lastName
    } = req.body;
    const email = req.body.email.toLowerCase();

    const candidate = await User.findOne({
      email
    });
    if (candidate) {
      return res.status(400).json({
        status: 'The email is already registered',
      });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      tests: [],
    });

    await newUser.save();

    res.status(200).json({
      status: 'User registered successfully'
    });
  } catch (e) {
    errorHandler(res, 500, e);
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      errorHandler(res, 401, new Error('Token is invalid'));
    }

    const userInfo = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      tests: user.tests,
    }

    res.status(201).json({
      status: "User authorized successfully",
      user: userInfo,
    })

  } catch (e) {
    errorHandler(res, 500, e);
  }
}
