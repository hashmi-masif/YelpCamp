var campground=require("../models/campground");
var comment=require("../models/comment")

var middlewareObject={};

middlewareObject.checkUserOwnerShip=function(req,res,next){

    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(err,campF){
            if(err){
                res.redirect("back");
            }else{
                //own camp
                if(campF.author.id.equals(req.user._id)){
               next();
                }else{
                  res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObject.checkCommentsOwnerShip=function(req,res,next){

    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,commF){
            if(err){
                res.redirect("back");
                req.flash("error","Campground Not found");
            }else{
                //own camp
                if(commF.author.id.equals(req.user._id)){
               next();
                }else{
                    req.flash("error","Permission Denied");
                  res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in first");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn=function(req,res,next){

    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You need to be logged in first");
        res.redirect("/login");
    }

}


module.exports=middlewareObject;