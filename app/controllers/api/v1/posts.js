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

      // user.posts.push(post._id);
      // await user.save();

      await db.Categories.updateMany(
        { _id: { $in: categories } },
        { $push: { posts: post._id } }
      );
      await db.Users.updateOne(
        { _id: req.user._id },
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
      const postCount = await db.Posts.count({ _id: req.params._id });
      const user = req.user;

      if (!req.user) {
        throw new Error(
          `Pleae login and provide authentication token to create a post ${req.user}`
        );
      }

      if (postCount === 1) {
        user.posts = user.posts.filter(
          (postItem) => postItem !== req.params._id
        );
      }

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

// const postBody = req.body.post;
//       const categoriesTitles = req.body.categories ? req.body.categories : [];
//       let categories = [];

//       if (categoriesTitles.length !== 0) {
//         categories = categoriesTitles.forEach(async (categoryTitle) => {
//           let category = await db.Categories.findOne({ title: categoryTitle });
//           let categories = [];

//           category = category
//             ? category
//             : await db.Categories.create({ title: categorTitle });

//           categories.push(category._id);
//           return categories;
//         });
//       }

//       const user = req.user
//         ? await db.Users.findOne({ _id: req.user._id })
//         : null;

//       if (user) {
//         user.posts.push(post._id);
//         await user.save();
//       }

//       console.log(categories);

//       const post = await db.Posts.create({
//         ...postBody,
//         categories: categories,
//       });

//       res.http200({ post });
//     } catch (error) {
//       res.http400({
//         message: "Sorry, could not create post",
//         error: error.toString(),
//       });
//     }

// //use categories array
// const categoryTitle = req.body.category;
// const postBody = ({ title, body, picture } = req.body);

// //check if picture exists

// const post = await db.Posts.create(postBody);

// const user = req.user
//   ? await db.Users.findOne({ _id: req.user._id })
//   : null;

// let category = categoryTitle
//   ? await db.Categories.findOne({ title: categoryTitle })
//   : null;

// if (category) {
//   post.categories.push(category._id);
//   category.posts.push(post._id);

//   await category.save();
//   await post.save();

//   // if(!post.categories.find(categoryId => categoryId === category._id)){
//   //   post.categories.push(category._id)
//   // }
// }

// if (user) {
//   user.posts.push(post._id);
//   await user.save();
// }
