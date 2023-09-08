const express=require("express");
const passport =require("passport");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
const session = require('express-session');

app.use(session({
    secret: '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', // Replace with a strong and secret key
    resave: false,
    saveUninitialized: true,
  }));
const { Strategy } = require('passport-google-oauth20');


app.use(passport.initialize());   //for handle authenication
app.use(passport.session());      //for storing and retrive that data into session 


//serialization  == data complex form --> user4 data convert in that format through that it can easily store in session or cookies
//complex into compact way (object) 
 
//deserialization  ==  opposite retrive or recontyruct that data from that stored format 

//here user is data we is converted into that format 
passport.serializeUser((user, cb) =>{
    console.log(user);
    cb(null, user);
});

passport.deserializeUser( (obj, cb)=> {
    cb(null, obj);
});
//config 
passport.use(new Strategy({
    clientID: process.env.clientSecret,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:5000/auth/google/callback'
},
function (accessToken, refreshToken, profile, done) {
    console.log(profile,accessToken);
    done(null, {});
}
));

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
(req, res, next) => {
    console.log(req.user, req.isAuthenticated());
    res.send('user is logged in');
})

app.get('/auth/fail', (req, res, next) => {
res.send('user logged in failed');
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.send('user is logged out');
    });
  });

app.listen(5000,()=>{
    console.log("Listening on port no ");
})