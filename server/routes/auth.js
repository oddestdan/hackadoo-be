const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.middleware');
const User = require('../models/User');
const authValidate = require('../validation/authValidation');

//* Sign in user
router.post('/login', async (req, res) => {
  const { err } = authValidate.loginUser.validate(req.body);
  if (err) {
    res.status(400).json({
      msg: err.details[0].message,
    });
  } else {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This user doesn't exist!" });

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res
            .status(200)
            .json({ status: 'User authenticated successfully', token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server error');
    }
  }
});

//* Register user
router.post(
  '/register',

  async (req, res) => {
    const { err } = authValidate.registerUser.validate(req.body);

    if (err) {
      res.status(400).json({
        msg: err.details[0].message,
      });
    } else {
      const { firstName, lastName, email, password } = req.body;

      try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({
          firstName,
          lastName,
          email,
          password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
          user: { id: user.id },
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res
              .status(200)
              .json({ status: 'User registered successfully', token });
          }
        );
      } catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
      }
    }
  }
);

//* Get user
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).send(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
