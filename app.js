//to use the env file
require("dotenv").config();

//express
const express=require("express");
const app=express();

//mongoDb
const connectDB=require("./server/config/db");
connectDB();
//layouts
const expressLayouts=require("express-ejs-layouts");

//metod-oveeride
const methodOverride=require("method-override")
//for req.body -> JSON
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride("_method"))
//to use js and css file LOCATED -> PUBLIC
app.use(express.static("public"))

//ejs
app.set("view engine","ejs")
//ejs layout
app.use(expressLayouts);
//setting the layouts
app.set("layout","./layouts/main");

//session
const session=require("express-session");
//passport 
const passport=require("passport")
//mongo store
const MongoStore=require("connect-mongo")


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie:{
        //by default rahta then to
        httpOnly:true,
        //expiration dates
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
  }));

//uses
app.use(passport.initialize());
app.use(passport.session());



//port
const port=7000 ||process.env.PORT

//routes
app.use("/",require("./server/routes/index"));
app.use("/",require("./server/routes/dashboard"));
app.use("/",require("./server/routes/auth"));






app.listen(port,(req,res)=>{
    console.log("APP LISTENING ON PORT 7000")
})

//to handle 404
app.get("*",(req,res)=>{
    res.status(404).render("404")
})