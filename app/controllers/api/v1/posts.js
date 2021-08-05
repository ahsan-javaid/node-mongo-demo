const db = global.db;
const mongoose = require("mongoose");
const { post } = require("../../../..");
const validator = require("../../../lib/validators/posts");

module.exports = (router) => {
  router.get("/", async (req, res) => {
    try {
      const posts = await db.Posts.find({})
        .sort({ _id: -1 })
        .skip(req.query.offset ? parseInt(req.query.offset) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 0);

      res.http200({ posts });
    } catch (error) {
      res.http400({
        message: "Sorry, posts could not be fetched",
        error: error.toString(),
      });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const posts = await db.Posts.findOne({ _id: req.params.id });
      res.http200({ posts });
    } catch (error) {
      res.http400({
        message: "Sorry, please provide a valid post id",
        error: error.toString(),
      });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { title, body, picture, categories } = req.body;

      let categoryIds = [];

      if (categories !== undefined && categories.length !== 0) {
        categories.forEach(async (categoryTitle) => {
          const category = await db.Categories.findOne({
            title: categoryTitle,
          });

          if (!category) {
            throw new Error(`Category: ${categoryTitle} does not exist`);
          }

          categoryIds = [...categoryIds, category._id];
        });
      }

      const user = req.user
        ? await db.Users.findOne({ _id: req.user._id })
        : null;

      if (user) {
        user.posts.push(post._id);
        await user.save();
      }

      const post = await db.Posts.create({
        title,
        body,
        picture,
        categories: categoryIds,
      });

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
      const user = await db.Users.findOne({ _id: req.user._id });

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
