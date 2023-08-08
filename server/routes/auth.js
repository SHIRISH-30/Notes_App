const express=require("express");
const router=express.Router();

//passport
const passport=require("passport")
const User=require("../models/User")
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, done) {
     //user model me yeh sab daalenge
     const newuser={
        googleId:profile.id,
        displayName:profile.displayName,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        profileImage:profile.photos[0].value,
     }
     try {
       
        //checking for user for existence
        let user=await User.findOne({googleId:profile.id});
        if(user)  //if user is present then ohk
        {
            done(null,user);
        }
        else{  //if not present then create 
            user=await User.create(newuser);
            done(null,user);
        }


     } catch (error) {
        console.log(error);
     }
  }
));

//google auth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', 
  { failureRedirect: '/login-failure' ,
     successRedirect:'/dashboard' }),
  );

  //router if something went wrong
  router.get("/login-failure",(req,res)=>{
    res.send("Something Went Wrong :(")
  })

 // Destroy user session
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
      if(error) {
        console.log(error);
        res.send('Error loggin out');
      } else {
        res.redirect('/')
      }
    })
  });
  

  // Presist user data after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
module.exports=router;
