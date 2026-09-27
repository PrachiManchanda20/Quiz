const express=require('express');
const router=express.Router();
const fs=require('fs');
const path=require('path');

router.get('/login',(req,res,next)=>{
    res.render('login');
})

router.post('/login',(req,res)=>{
    const data=fs.readFileSync(path.join(__dirname, '..', 'data', 'learner.json'),'utf8');

    const file=JSON.parse(data);

    const username=req.body.username;
    const role=req.body.role;
    const password=req.body.password;

    // console.log(req.body);
    const user={
        username,
        password,
        role,
    }
    console.log(req.body);
    const userData=file.find((t)=>t.password==password && t.username==username)
    // console.log(req.body);
    if(userData){
        req.session.user={
            username: userData.username,
            role: userData.role,
        }
        // file.push(user);
    
    
    if(role=='learner'){
        res.redirect('/learner/dashboard');
    }
    
    console.log(req.body);
}
else{
    res.redirect('/auth/signin');
}
})
router.get('/signin',(req,res,next)=>{
    res.render('signin');
})

module.exports=router;