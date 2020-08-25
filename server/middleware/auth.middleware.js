const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');

require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    errorHandler(res, 500, e);
  }
};
