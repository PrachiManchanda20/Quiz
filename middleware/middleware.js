const isAuthenticate=(req,res,next)=>{
    if(req.session && req.session.user){
        return next();
    }
    
    return res.redirect('/auth/signin');
}
module.exports=isAuthenticate;