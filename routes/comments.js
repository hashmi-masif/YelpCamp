var campground=require("../models/campground");
var comment=require("../models/comment");
var express=require("express");
var middleWare=require("../middleware/index");
var router=express.Router();

router.get("/campgrounds/:id/comment/new",middleWare.isLoggedIn,function(req,res){
    
    campground.findById(req.params.id,function(err,camp){
    
        if(err){
            console.log(err);
        }else{
            console.log(campground.name);
            res.render("comment/new",{campground:camp});
        }
    
    });
    
    });
    
    router.post("/campgrounds/:id/comment",middleWare.isLoggedIn,function(req,res){
        campground.findById(req.params.id,function(err,campground){
    if(err){
        res.redirect("campground/show");
    }else{
        comment.create(req.body.comment,function(err,comm){
            if(err){
                req.flash("error","Something went Wrong");
                console.log(err);
            }else{
                    //add user name id
                    comm.author.id=req.user._id;
                    comm.author.username=req.user.username;
                    comm.save();
                    console.log(comm);
                campground.comments.push(comm);
                campground.save();
                console.log(campground.comments.text);
                req.flash("success","Successfully Added Comment");
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    }
    
        });
        });

        router.get("/campgrounds/:id/comments/:comment_id/edit",middleWare.checkCommentsOwnerShip,function(req,res){
                comment.findById(req.params.comment_id,function(err,comm){
                    if(err){
                        res.redirect("back");
                    }else{
                        res.render("comment/edit",{campground_id:req.params.id,comments:comm});
                    }
                });
        });


        router.put("/campgrounds/:id/comments/:comment_id",middleWare.checkCommentsOwnerShip,function(req,res){

            comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,Ucomm){
                if(err){
                    req.flash("error","Something went Wrong");
                    res.redirect("back");
                }else{
                    req.flash("success","Successfully Updated");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });

        });

        router.delete("/campgrounds/:id/comments/:comment_id",middleWare.checkCommentsOwnerShip,function(req,res){
                comment.findByIdAndRemove(req.params.comment_id,function(err){
                    if(err){
                        res.redirect("back");
                        req.flash("error","Something went wrong");
                    }else{
                        req.flash("success","Successfully deleted campground");
                    res.redirect("/campgrounds/"+req.params.id);
                    }
                });
        });


        module.exports=router;