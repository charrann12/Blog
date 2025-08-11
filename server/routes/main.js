const express = require('express');
const router = express.Router();
const Post = require('../models/post');

/*
GET/
HOME

*/
router.get('/', async (req, res) => {

    try{
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog creation using node, express and Mongo DB"
        }
        // for no of blogs in a page
        let perPage = 5;
        // for the http request in the search bar
        let page = req.query.page || 1;

        // the oldest one sorted
        const data = await Post.aggregate([{$sort: {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec()


        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        
        
        res.render('index', {locals,
             data,
             current: page,
             nextPage: hasNextPage ? nextPage :null

            });
    }catch(error){
        console.log(error);
    }


    
});





router.get('/about', (req, res) => {
    res.render('about');
});


router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;


/*
GET/
post: id

*/

router.get('/post/:id', async(req, res)=>{

    try{
        const locals={
            title: "NodeJs Blog",
            description: "Simple blog created using Nodejs, MongoDB and expressJS" 
        }

        let slug = req.params.id;


        const data = await Post.findById({ _id: slug});
        res.render('post', {locals, data});
    }catch(error){
        console.log(error);
    }
})

/*
function insertPostData(){
    Post.insertMany([
        {
            title: "Building a blog",
            body: "This is a body text"
        },
    ])
}

insertPostData();

*/
