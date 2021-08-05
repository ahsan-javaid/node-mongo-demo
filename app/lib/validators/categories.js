const Joi = require('joi');
const validateRequest = require('./index').validateRequest;

exports.addCategory = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().valid('Politics', 'Gaming', 'Sports', 'Social', 'Economy', 'Research', 'Personal').required(),
    description: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
}
