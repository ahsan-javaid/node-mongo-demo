const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const modelName = 'Users';

const schema = new mongoose.Schema({
  firstName: {type: String, required: false},
  lastName: {type: String, required: false},
  email: {type: String, required: true, lowercase: true},
  password: {type: String, select: false},
  phoneNumber: {type: String},
  about: {type: String},
  picture: {type: String, default: 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png'},
  //Adding Posts here as => User has Many Posts
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts"
  }],
  createdAt: {type: Date, default: Date.now, select: false},
  updatedAt: {type: Date, default: Date.now, select: false},
}, {collection: modelName});

schema.statics.getHashedPassword = function (password) {
  return crypto.createHash('sha256').update(password).digest('base64');
};

schema.methods.createAPIToken = function () {
  const payload = {};
  payload._id = this.toClientObject()._id;
  payload.email = this.toClientObject().email;
  payload.model = 'Users';
  return jwt.sign(payload, global.kraken.get('app:jwtSecret'));
};

schema.methods.toClientObject = function () {
  const rawObject = this.toObject();
  delete rawObject.__v;
  return rawObject;
};

module.exports = mongoose.model(modelName, schema);

