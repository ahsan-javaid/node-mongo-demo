const db = global.db;
const validator = require('../../../lib/validators/posts');

module.exports = (router) => {
    router.post('/', validator.addPost,async (req, res) => {
        req.body.user = req.user;
        const post = await db.Posts.create(req.body)
        console.log(post.id);
        res.http200({ Post: post });
    });

    router.get('/', async (req, res) => {
        const post = await db.Posts.find({})
            .skip(req.query.offset ? parseInt(req.query.offset) : 0)
            .limit(req.query.limit ? parseInt(req.query.limit) : 0)

        res.http200({ Posts: post });
    });

    router.put('/',validator.addPost, async (req, res) => {
        req.body.user = req.user;
        const post = await db.Posts.findOneAndUpdate({
            title: req.body.title,
            user: req.user
        }, req.body, {
            upsert: false
        })
       // console.log(post);
        if (post === null)
            res.http400('Post not found');
        else
            res.http200({ Posts: post });
    });

    router.delete('/',  async (req, res) => {
        const post = await db.Posts.deleteOne({ "_id": req.body.id });
        if (post.deletedCount === 0)
            res.http400('Post not found');
        else
            res.http200({ Posts: post });
    })

    router.get('/allPosts', async(req, res)=>{
        const post= await db.Posts.find({user: req.user}).populate('user');
        res.http200({ Posts: post });
    })


}
