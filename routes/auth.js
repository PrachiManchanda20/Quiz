const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { error } = require('console');


router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, '..', 'data', 'learner.json'), 'utf8');

    const file = JSON.parse(data);

    const username = req.body.username;
    const role = req.body.role;
    const password = req.body.password;
    const email = req.body.email;

    const user = {
        username,
        password,
        email,
        role,
    }

    console.log(req.body);
    const userData = file.find((t) => t.password == password && t.username == username)

    if (userData) {
        req.session.user = {
            username: userData.username,
            role: userData.role,
            email: userData.email
        }

        if (role == 'learner') {
            res.redirect('/learner/dashboard');
        }

        console.log(req.body);
    }
    else {
        res.render('login',{error: true,
            errorMsg: "Incorrect Password"});
        // res.send("Wrong password");//if pass is wrong
    }

})

router.get('/signin', (req, res, next) => {
    res.render('signin');
})

router.post('/signin', (req, res, next) => {
    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'learner.json'), 'utf8');
    const parsedFile = JSON.parse(file);
    console.log(parsedFile);
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

    const user = {
        username: username,
        email: email,
        password: password,
        role: role
    }
    if (role == 'learner') {

        let existed = parsedFile.find((el) => el.username == username && el.password == password)
        if (existed) {
            console.log("already Login");
            res.render('login');
        }
        else {
            console.log("redirected");
            req.session.user = {
                username: username,
                role: role,
                email: email
            }
            res.redirect('/learner/dashboard');
        }
    }
    else {

        res.redirect('/admin/dashboard');
    }
    parsedFile.push(user);
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'learner.json'), JSON.stringify(parsedFile, null, 2));

})


router.get('/changePass', (req, res, next) => {
    res.render('changePass');
})

router.post('/changePass', (req, res, next) => {
    const file = fs.readFileSync(path.join(__dirname, '..', 'data', 'learner.json'), 'utf8');
    const parsData = JSON.parse(file);

    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    let rePAss = req.body.rePAss;
    let email = req.body.email;
    let role = req.body.role;

    const userGmail = 'manchandaprachi69@gmail.com';
    const userPass = 'eulk pyip rmzy odes';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: userGmail, pass: userPass }
    })
    if (email == userGmail || password == userPass) {
        return res.render('resetPass', {
            error: true,
            errorMsg: "Email is not configured. Pleasec contact support." });
    }

    const user = parsData.find((entry) => entry.email == email);
    console.log("token ");
    if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        const baseUrl = `http://localhost:${2000}`;
        const resetUrl = `${baseUrl}/auth/resetPass/${token}`;
        
        console.log(token);
        console.log(user);
        // user.hashTokenPass=bcrypt.hash(token ,10);
        user.token=token;
        user.passExpiry=Date.now()+ 60* 60* 1000;
        fs.writeFileSync(path.join(__dirname,'..','data','learner.json'),JSON.stringify(parsData,null,2));
    
    try{
        transporter.sendMail({
            from: userGmail,
            to: user.email,
            subject:"Reset Password",
            text:`Click the link to reset your password. It expires in one hour: ${resetUrl}`,
            html:`<p>Click the link to reset your password</p><a href=${resetUrl}>Reset</a>`,
        });
        console.log("hii try block"); 
    }
    catch(error){
        delete user.token;
        delete user.passExpiry;
        fs.writeFileSync(path.join(__dirname,'..','data','learner.json'),JSON.stringify(parsData,null,2));
        console.log(error);  
    }
    }
    res.render('resetPass',{
        error: true,
        errorMsg: "Change password link is sent to your Email id"
    });
    

    // if (password == rePAss) {
    //     console.log("matched!");

    //     for (let data of parsData) {
    //         if (data.email == email && data.username == username) {
    //             data.password = password;
    //         }
    //     }
    //     console.log(parsData);

    //   
    //     fs.writeFileSync(path.join(__dirname, '..', 'data', 'learner.json'), JSON.stringify(parsData, null, 2));
        // req.session.user = {
        //     username: username,
        //     role: role,
        //     email: email
        // }
    //     res.redirect('/learner/dashboard');
    // }
    // else {
    //     console.log("MisMtch");
    //     res.render('changePass');

    // }


})

router.get('/resetPass/:token', (req, res, next) => {
    const data=fs.readFileSync(path.join(__dirname,'..','data','learner.json'));
    const parseData=JSON.parse(data);

    const token=req.params.token;

    const user=parseData.find((data)=>data.token == token);

    if(!user){
        return res.render('signin');
    }
    if(Date.now() > user.passExpiry){
        return res.render('signin');
    }

    console.log("user exist and it's expiry limit has not reached!");
    res.render('resetPass',{token: token});
    // res.send("Pass changed!");
})

router.post('/resetPass/:token',(req,res,next)=>{

    const data=fs.readFileSync(path.join(__dirname,'..','data','learner.json'));
    const parseData=JSON.parse(data);

    const token=req.params.token;

    const user=parseData.find((data)=>data.token == token);

    if(!user){
        return res.render('signin');
    }
    if(Date.now() > user.passExpiry){
        return res.render('signin');
    }

    const password=req.body.password;
    const rePAss=req.body.rePAss;

    if(!password || password != rePAss){
        return res.render('resetPass',{token: token ,
            error: true,
            errorMsg: "Password doesn't Match"
        });
    }

    user.password=password;

    delete user.token;
    delete user.passExpiry;

    req.session.user={
        username: user.username,
        role: user.role,
        email: user.email
    }

    fs.writeFileSync(path.join(__dirname,'..','data','learner.json'),JSON.stringify(parseData,null,2));
    res.redirect('/learner/dashboard');
    res.send("Pass changed!"); 
})

module.exports = router;