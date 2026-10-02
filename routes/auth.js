const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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
        // res.redirect('/auth/signin');
        res.send("ended");
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
    parsedFile.push(user);
    if (role == 'learner') {
        // for(let parse of parsedFile){
        //     if(parse.username==username && parse.password==password){
        // console.log("already Login");
        // res.render('login');
        //     }
        // }
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
    if (password == rePAss) {
        console.log("matched!");

        for (let data of parsData) {
            if (data.email == email && data.username == username) {
                data.password = password;
            }
        }
        console.log(parsData);

        // res.redirect('/learner/dashboard');

        //     error:false,
        //     errorMsg:""});
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'learner.json'), JSON.stringify(parsData, null, 2));
        req.session.user = {
            username: username,
            role: role,
            email: email
        }
        res.redirect('/learner/dashboard');
    }
    else {
        console.log("MisMtch");
        res.render('changePass');
        //     error:true,
        //     errorMsg:"Password doesn't match!"}
        // );
    }

})



module.exports = router;