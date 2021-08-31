const Joi = require('joi');
const validateRequest = require('./index').validateRequest;
exports.signup = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('USER', 'CHEF', 'KICHEN_OWNER', 'ADMIN').required()
  });
  validateRequest(req, res, next, schema);
}

exports.login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  validateRequest(req, res, next, schema);
}
