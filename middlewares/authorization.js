function checkAuthorization(req,res,next) {
    if(req.user.role==="ADMIN"){
        return next();
    }else{
        return res.render("error");
    }
}
module.exports=checkAuthorization