const Joi = require('@hapi/joi');

module.exports = {
  registerUser: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('shipper', 'driver').required(),
  }),
  loginUser: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
};
