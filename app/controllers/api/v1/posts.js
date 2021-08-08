const db = global.db;
const validator = require("../../../lib/validators/posts");

module.exports = (router) => {
  router.get("/", async (req, res) => {
    try {
      const posts = await db.Posts.find({ _id: { $in: req.user.posts } })
        .populate("categories", ["-posts", "-__v"])
        .sort({ _id: -1 })
        .skip(req.query.offset ? parseInt(req.query.offset) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 0);

      res.http200({ posts });
    } catch (error) {
      res.http400({
        message: "Sorry, could not fetch posts",
        error: error.toString(),
      });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const post = await db.Posts.findOne({ _id: req.params.id }).populate(
        "categories"
      );

      post
        ? res.http200({ post: post })
        : res.http404("Sorry, could not find post");
    } catch (error) {
      res.http400({
        message: "Sorry, could not fetch post",
        error: error.toString(),
      });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, body, picture, categories: categoryTitles } = req.body;

      if (categoryTitles === undefined) {
        throw new Error(
          "Categories not provided. Please provide categories (categories: ['categoryA', 'categoryB'])"
        );
      }

      if (!req.user) {
        throw new Error(
          `Pleae login and provide authentication token to create a post ${req.user}`
        );
      }

      const categories = await db.Categories.find({
        title: { $in: categoryTitles },
      });

      let categoryIds = [];
      for (const category of categories) {
        categoryIds.push(category._id);
      }

      const post = await db.Posts.create({
        title,
        body,
        picture,
        categories: categoryIds,
      });

      await db.Users.updateOne(
        { _id: req.user._id },
        { $push: { posts: post._id } }
      );

      await db.Categories.updateMany(
        { _id: { $in: categories } },
        { $push: { posts: post._id } }
      );

      res.http200({ post });
    } catch (error) {
      res.http400({
        message: "Sorry, could not create post",
        error: error.toString(),
      });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const post = await db.Posts.updateOne({ _id: req.params.id }, req.body);
      res.http200({ post });
    } catch (error) {
      res.http400({
        message: "Sorry, could not update post",
        error: error.toString(),
      });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      if (!req.user) {
        throw new Error(
          `Pleae login and provide authentication token to create a post ${req.user}`
        );
      }

      await db.Categories.updateMany({}, { $pull: { posts: req.params.id } });

      await db.Users.updateOne(
        { _id: req.user._id },
        { $pull: { posts: req.params.id } }
      );

      const post = await db.Posts.remove({ _id: req.params.id });

      res.http200({ post });
    } catch (error) {
      res.http400({
        message: "Sorry, could not delete post",
        error: error.toString(),
      });
    }
  });
};
