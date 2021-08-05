const mongoose = require('mongoose');
const modelName = 'Categories';

const schema = new mongoose.Schema({
  title: {type: String, required: false},
  description: {type: String, required: false},
  picture: {type: String, required: false},
  //Adding posts here as => Many Posts has Many Categories
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts"
  }],
  createdAt: {type: Date, default: Date.now, select: false},
  updatedAt: {type: Date, default: Date.now, select: false},
}, {collection: modelName});

module.exports = mongoose.model(modelName, schema);

