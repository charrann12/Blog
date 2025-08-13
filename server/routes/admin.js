const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/*
GET/
Check Login
*/


// token authentication so that even it the token gets altered the site will show unauthorized

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
     
    if(!token){
        return res.status(401).json({message: 'Unauthorised'});
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        res.status(401).json({message: 'Unauthorised'});
    }
}





/*
GET/
Admin - Login Page
*/ 

router.get('/admin', async(req, res)=>{
    try{
        const locals={
            title: "Admin",
            description: "Simple blog created using Nodejs, MongoDB and expressJS" 
        }

        res.render('admin/index', {locals, layout: adminLayout});
    }catch(error){
        console.log(error);
    }
});

/*
POST/
Admin - Check Login 
*/

router.post('/admin', async(req, res)=>{
    try{
     const {username, password } = req.body;
     
     // validating username
     const user = await User.findOne( { username } );
     if(!user){
        return res.status(401).json( {message: 'Invalid Credentials'} );
     }

     // validating password
     const isPasswordValid = await bcrypt.compare(password, user.password);

     if(!isPasswordValid){
        return res.status(401).json( {message: 'Invalid Credentials'} );
     }

    // token initialisation for security breach 
     const token = jwt.sign({userId: user._id}, jwtSecret);
     res.cookie('token', token, { httpOnly: true });

     res.redirect('/dashboard');

    


    }catch(error){
        console.log(error);
    }
});




/*
POST/
Admin - Check Login 
*/
router.get('/dashboard', authMiddleware, async(req, res)=>{
 
    res.render('admin/dashboard');

});



/*
POST/
Admin - Register  
*/

router.post('/register', async(req, res)=>{
    try{

     const {username, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);

     try{
        const user = await User.create({username, password:hashedPassword});
        res.status(201).json({message: 'User created', user});
     }catch(error){
        if(error.code === 11000){
            res.status(409).json({message: 'User aleady in use'});
        }
        res.status(500).json({message: 'Internal Server Error'});
     }

    }catch(error){
        console.log(error);
    }
});



module.exports = router;