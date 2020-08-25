const Joi = require('@hapi/joi');

module.exports = {
  registerForm: Joi.object({
    email: Joi.string().email({minDomainSegments: 2}).insensitive().required(),
    password: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .min(6)
        .max(128)
        .required(),
    firstName: Joi.string().max(128).required(),
    lastName: Joi.string().max(128).required(),
  }),

  loginForm: Joi.object({
    email: Joi.string().email({minDomainSegments: 2}).insensitive().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
};
