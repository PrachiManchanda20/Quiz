const express=require('express');
const cors=require('cors');
const app=express();
const session=require('express-session');
const nodemailer=require('nodemailer');
// const multer =  require('multer');

// const upload = multer();

const multer = require('./middleware/uploadMiddleware.js');


app.set("view engine", 'ejs');



app.use(session({
    secret:'some secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    resave:false,
    saveUninitialized: false,

}))
app.use(express.urlencoded({extended:true}));

app.use('/',multer);

const isAuthenticate=require('./middleware/middleware');
const authRoute= require('./routes/auth.js');
const learnerRoute=require('./routes/learner.js');
const adminRoute=require('./routes/admin.js');

const path=require('path');

// app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');

app.use('/auth',authRoute);
app.use('/learner',isAuthenticate,learnerRoute);
app.use('/admin',isAuthenticate,adminRoute);

app.get('/',(req,res,next)=>{
    res.render('index');
})


app.listen(2000,()=>{
    console.log("server is on line");
})