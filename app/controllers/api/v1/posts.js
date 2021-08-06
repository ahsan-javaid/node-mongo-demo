const db = global.db;
const validator = require('../../../lib/validators/posts');

module.exports = (router) => {

  router.get('/', async (req, res) => {
    try {
        // const posts = await db.Posts.find({})
        // .sort({_id: -1})
        // .skip(req.query.offset ? parseInt(req.query.offset) : 0)
        // .limit(req.query.limit ? parseInt(req.query.limit) : 0)
        //console.log(req.user.posts);
        const posts = await db.Posts.find({ '_id': { $in: req.user.posts } }).populate("categories");
        res.http200({Posts: posts});

    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.get('/:id', async (req, res) => {
    try {
        const post = await db.Posts.findOne({_id: req.params.id}).populate("categories");
        
        if(post)
            res.http200({post: post});
        else
            res.http404("Post not found!");

    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.post('/', validator.addPost, async (req, res) => {
    try {
        const {title, body, category} = req.body;
        const categoryTemp = await db.Categories.find({ 'title': { $in: category}});

        categoryTemp.forEach((element, index, arr) => {
          arr[index] = element._id;
        });

        let postBody = {
          title,
          body,
          categories: categoryTemp
        };
        const post = await db.Posts.create(postBody);

        await db.Categories.updateMany({'_id': { $in: categoryTemp }},{ $push: {posts: post._id}});
        await db.Users.updateOne({ _id: req.user._id}, {$push: { posts: post._id}});
        res.http200({post: post});

    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.put('/:id', validator.addPost, async (req, res) => {
    try {
        const post = await db.Posts.updateOne({_id: req.params.id}, req.body);
        res.http200({post: post});
    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
        const categories = await db.Categories.updateMany({}, { $pull: {posts: req.params.id} });
        const post = await db.Posts.remove({_id: req.params.id});
        res.http200({post: post});
    } catch (error) {
        res.http400(error.toString());
    }
  });
}
