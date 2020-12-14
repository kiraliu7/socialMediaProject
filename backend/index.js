const auth = require('./src/auth');
const doarticle = require("./src/articles");
const doprofile = require("./src/profile");
const dofollowing = require("./src/following");
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const mongoose = require('mongoose');
const userSchema = require('./src/userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./src/profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const followingSchema = require('./src/followingSchema');
const Following = mongoose.model('following', followingSchema);
const connectionString = 'mongodb+srv://kiraliu7:972015@cluster0.cpc2c.mongodb.net/social?retryWrites=true&w=majority';
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const cors = require('cors');

const corsOptions = {origin: 'https://tall-glass.surge.sh', credentials: true};
//const corsOptions = {origin: 'http://localhost:3000', credentials: true};
const hello = (req, res) => res.send({ status: 'send requests from https://tall-glass.surge.sh/' });

/*  
const enableCORS = (req, res, next) =>{
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, Origin, X-Requested-with");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Expose-Headers", "Location, X-Session-Id");
    if(req.method =="OPTIONS"){
        res.status(200).send("OK");
    }
    else{
        next();
    }

}
*/

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));
//app.use(enableCORS);

//FACEBOOK STARTS
app.use(session({
    secret: 'doNotGuessTheSecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: '412059910123671',
    clientSecret: '5564a77beaf69c38b9828af300253fca',
    callbackURL: "/auth/facebook/callback",
    passReqToCallback: true
},
    async function(req, accessToken, refreshToken, profile, done) {
        
        let user = {
            'displayname' : profile.displayName,
            'username'   : profile.id,
            'token': accessToken,
        };
        // You can perform any necessary actions with your user at this point,
        // e.g. internal verification against a users table,
        // creating new user entries, etc.

        if(!req.cookies["username"]){
            let found=await (connector.then(()=> {
                return Profile.find({username: user.username})}));
            if(found.length==0){
                let existed=await (connector.then(()=> {
                    return User.find({oauth: {"facebook": user.username}})}));
                if(existed.length==0){
                    let newprofile=await (connector.then(()=> {
                        return new Profile({username: user.username, displayname: user.displayname, headline: "I am new", email:"need manual update", zipcode:"need manual update", phone: "need manual update", dob: new Date("1974-02-02T01:05:22.000+00:00"), avatar: "https://res.cloudinary.com/hzwltjyu9/image/upload/v1607016549/owllogo_om0gab.png"})}));
                    newprofile.save();
        
                    let newfollowing=await (connector.then(()=> {
                        return new Following({username: user.username, followlist: [user.username]})}));
                    newfollowing.save();
                    return done(null, user);
                }
                else{
                    let temp=await (connector.then(()=> {
                        return Profile.findOne({username: existed[0].username})}));
                    let altuser = {
                        'displayname' : temp.displayname,
                        'username'   : temp.username,
                        'token': accessToken,
                    };
                    return done(null, altuser);
                }          
            }
            return done(null, user);
        }
        else{
            let tempp=await (connector.then(()=> {
                return Profile.deleteOne({username: user.username})}));
           let tempf=await (connector.then(()=> {
                return Following.deleteOne({username: user.username})}));
            let localprofile=await (connector.then(()=> {
                return Profile.findOne({username: req.cookies["username"]})}));
            let altuser = {
                'displayname' : localprofile.displayname,
                'username'   : localprofile.username,
                'token': accessToken,
            };
            let localuser=await (connector.then(()=> {
                return User.updateOne({username: req.cookies["username"]}, {$set: {oauth: [{"facebook": user.username}]}})}));
            
            return done(null, altuser);

        }
    })
);
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook')); // could have a passport auth second arg {scope: 'email'}

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: 'http://localhost:3000/main',
        failureRedirect: '/' }));

//FACEBOOK END


//express endpoints would normally start here
app.get('/', hello);
auth(app);
doarticle(app);
doprofile(app);
dofollowing(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
