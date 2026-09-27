const express=require('express');
const router=express.Router();


router.get('/dashboard',(req,res)=>{
    res.render('dashbord',{
        username: req.session.user.username
    });
})
router.post('/dashboard/difficulty:',(req,res)=>{
   res.render('n')//start krna h
})
module.exports=router;