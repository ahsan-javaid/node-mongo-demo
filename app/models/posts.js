const mongoose = require("mongoose");
const modelName = "Posts";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    body: { type: String, required: false },
    picture: { type: String, required: false },
    categories: [{ type: mongoose.Types.ObjectId, ref: "Categories" }],
    createdAt: { type: Date, default: Date.now, select: false },
    updatedAt: { type: Date, default: Date.now, select: false },
  },
  { collection: modelName }
);

module.exports = mongoose.model(modelName, schema);
