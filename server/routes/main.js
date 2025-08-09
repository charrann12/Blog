const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog creation using node, express and Mongo DB"
    }


    res.render('index', {locals});
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;
