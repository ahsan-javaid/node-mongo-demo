const db = global.db;
const validator = require('../../../lib/validators/posts');

module.exports = (router) => {

  router.get('/', async (req, res) => {
    try {
        const posts = await db.Posts.find({})
        .sort({_id: -1})
        .skip(req.query.offset ? parseInt(req.query.offset) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 0)

        res.http200({Posts: posts});
    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.get('/:id', async (req, res) => {
    try {
        const post = await db.Posts.findOne({_id: req.params.id});
        
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
        const post = await db.Posts.create(req.body)
        res.http200({post: post});
    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.put('/:id', async (req, res) => {
    try {
        const post = await db.Posts.updateOne({_id: req.params.id}, req.body)
        res.http200({post: post});
    } catch (error) {
        res.http400(error.toString());
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
        const post = await db.Posts.remove({_id: req.params.id})
        res.http200({post: post});
    } catch (error) {
        res.http400(error.toString());
    }
  });
}
