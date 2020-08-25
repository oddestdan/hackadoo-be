const {body, validationResult} = require('express-validator');
const userValidationRules = () => {
  return [
    // username must be an email
    body('email', 'Invalid email').isEmail(),
    // password must be at least 6 chars long
    body(
        'password',
        'Password must be at least 6 characters').isLength({min: 6}),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({[err.param]: err.msg}));

  return res.status(422).json({
    errors: extractedErrors,
    message: 'Registration data is incorrect. Try again',
  });
};

module.exports = {
  userValidationRules,
  validate,
};
