const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) res.status(401).json({ msg: 'Authorisation denied' });

  try {
    const decrypted = jwt.verify(token, config.get('jwtSecret'));
    console.log(decrypted.user);
    req.user = decrypted.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
