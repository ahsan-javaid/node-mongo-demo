const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const modelName = 'Posts';

const schema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: false},
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdAt: {type: Date, default: Date.now, select: false},
  updatedAt: {type: Date, default: Date.now, select: false},
}, {collection: modelName});


module.exports = mongoose.model(modelName, schema);

