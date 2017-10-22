
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var request=require("request");
var mongoose=require("mongoose");
var campground=require("./models/campground");
var comment=require("./models/comment");
var passport=require("passport");
var User=require("./models/user");
var passportLocalMongoose=require("passport-local-mongoose");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var flash=require("connect-flash");

var campgroundR=require("./routes/campgrounds");
var commentsR=require("./routes/comments");
var indexR=require("./routes/index");




app.use(flash());


app.use(require("express-session")({
    secret:"Asif is hero",
    resave:false,
    saveUninitialized:false
}));


app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());



app.use(express.static(__dirname+"/public"));
// mongoose.connect("mongodb://localhost/yelp_camp_v10");
mongoose.connect("mongodb://asif:wanrltw@ds227045.mlab.com:27045/yelp_camp69",{useMongoClient: true});

//  mongodb://asif:wanrltw@ds227045.mlab.com:27045/yelp_camp69

app.use(bodyParser.urlencoded({extended:true}));



app.set("view engine","ejs");
app.listen(3000,function(){
    console.log("YelpCamp Server started");
});

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


app.use(campgroundR);
app.use(commentsR);
app.use(indexR);

