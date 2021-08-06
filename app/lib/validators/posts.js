const Joi = require('joi');
const validateRequest = require('./index').validateRequest;

exports.addPost = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    category: Joi.array().items(Joi.string().valid('Politics', 'Gaming', 'Sports', 'Social', 'Economy', 'Research', 'Personal').required()),
  });
  validateRequest(req, res, next, schema);
}
