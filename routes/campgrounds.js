var express=require("express");
var router=express.Router();
var campground=require("../models/campground");
var bodyParser=require("body-parser");
var middleWare=require("../middleware/index")

router.get("/campgrounds",function(req,res){
    campground.find({},function(err,allCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campground/campground",{campground:allCamp});
        }
    });             
});

router.get("/",function(req,res){
    
        res.render("land");
    
    });

router.post("/campgrounds",middleWare.isLoggedIn,function(req,res){
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var price=req.body.price;

    var newCampground={name:name,price:price,image:image,description:description,author:author};
//saving new campground to db
    campground.create(newCampground,function(err,newCamp){
            if(err){
                req.flash("error","Something went wrong");
                console.log(err);
            }else{
                console.log(newCamp);
                req.flash("success","Successfully created campground");  
    res.redirect("/campgrounds");
            }
    });
});

// new route
router.get("/campgrounds/new",middleWare.isLoggedIn,function(req,res){
res.render("campground/new");
});

router.get("/campgrounds/:id",function(req,res){
    
    campground.findById(req.params.id).populate("comments").exec(function(err,fcamp){
            if(err){
                console.log(err);
            }else{
                res.render("campground/show",{campId:fcamp});
            }

    });
       

});

//Edit campground route
router.get("/campgrounds/:id/edit",middleWare.checkUserOwnerShip,function(req,res){
        campground.findById(req.params.id,function(err,campF){
          res.render("campground/edit",{campground:campF});
            });
        });
   


//Update campground route
router.put("/campgrounds/:id",middleWare.checkUserOwnerShip,function(req,res){
    
campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,UcampG){
    if(err){
        req.flash("error","Something went wrong");
       res.redirect("/campgrounds");
    }else{
        req.flash("success","Successfully Updated");
            res.redirect("/campgrounds/"+req.params.id);
    }
});

});

//destroy

router.delete("/campgrounds/:id",middleWare.checkUserOwnerShip,function(req,res){
campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
        req.flash("error","Something went Wrong");
        console.log(err);
    }else{
        req.flash("success","Successfully deleted campground");
        res.redirect("/campgrounds");
    }
})
});



module.exports=router;