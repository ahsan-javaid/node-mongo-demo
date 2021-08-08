const db = global.db;
const validator = require("../../../lib/validators/categories");

module.exports = (router) => {
  router.get("/", async (req, res) => {
    try {
      const categories = await db.Categories.find({})
        .sort({ _id: -1 })
        .skip(req.query.offset ? parseInt(req.query.offset) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 0)
        .populate("Posts");

      res.http200({ categories: categories });
    } catch (error) {
      res.http400({
        message: "Sorry, could not fetch categories",
        error: error.toString(),
      });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const category = await db.Categories.findOne({ _id: req.params.id });
      res.http200({ category: category });
    } catch (error) {
      res.http400({
        message: "Sorry, could not fetch category",
        error: error.toString(),
      });
    }
  });

  router.post("/", validator.addCategory, async (req, res) => {
    try {
      const category = await db.Categories.create(req.body);
      res.http200({ category: category });
    } catch (error) {
      res.http400({
        message: "Sorry, could not create category",
        error: error.toString(),
      });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const category = await db.Categories.updateOne(
        { _id: req.params.id },
        req.body
      );
      res.http200({ category: category });
    } catch (error) {
      res.http400({
        message: "Sorry, could not update category",
        error: error.toString(),
      });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const category = await db.Categories.remove({ _id: req.params.id });
      res.http200({ category: category });
    } catch (error) {
      res.http400({
        message: "Sorry, could not delete category",
        error: error.toString(),
      });
    }
  });
};
