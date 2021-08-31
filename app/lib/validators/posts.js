const Joi = require('joi');
const validateRequest = require('./index').validateRequest;

exports.addPost = (req, res, next) => {
    console.log('in addPost validator')
  const schema = Joi.object({
    title: Joi.string().required().lowercase(),
    description: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
}
