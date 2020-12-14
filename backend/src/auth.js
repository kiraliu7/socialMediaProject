const md5 = require('md5');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('user', userSchema);
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const followingSchema = require('./followingSchema');
const Following = mongoose.model('following', followingSchema);
const connectionString = 'mongodb+srv://kiraliu7:972015@cluster0.cpc2c.mongodb.net/social?retryWrites=true&w=majority';
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

if (!process.env.REDIS_URL) {
    process.env.REDIS_URL="redis://h:p640af89585d0f6d12da49c0e7327886b122a41b17d815025c21b57783d7d5eab@ec2-23-20-105-142.compute-1.amazonaws.com:30629";
}

const redis=require("redis").createClient(process.env.REDIS_URL);

let cookieKey = "sid";

function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()){
        req.username=req.user.username;
        next();
    }
    else{
        // likely didn't install cookie parser
        if (!req.cookies) {
        return res.sendStatus(401);
        }

        let sid = req.cookies[cookieKey];

        // no sid for cookie key
        if (!sid) {
            console.log("no sid for cookie key")

            return res.sendStatus(401);
        }


        redis.hget("sessions", sid, function(err, username){
            if (username) {
                req.username = JSON.parse(username);
                next();
            }
            else {
                console.log("no username mapped to sid")
                return res.sendStatus(401)
            }
        });
    }

}

async function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let user=await(getUser(username));

    if (user.length==0) {
        return res.sendStatus(401)
    }

    user=user[0];

    let hash = md5(user.salt + password);

    if (hash === user.hash) { 
        let sid = md5(user.salt+new Date().getTime()) 

        res.cookie(cookieKey, sid, {maxAge: 3600*1000, httpOnly: true});
        res.cookie("username", username, {maxAge: 3600*1000, httpOnly: true});
        let msg = {username: username, result: 'success'};

        res.send(msg);

        redis.hmset("sessions", sid, JSON.stringify(username));
    }
    else {
        res.sendStatus(401);
    }
}

async function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let previousrecord=await(getUser(username));

    if(previousrecord.length!=0){
        console.log("here2");
        res.send("Username is not available. Failed to register");
    }

    else{
        let salt = username + new Date().getTime();
        let hash = md5(salt + password); 
        
    
        insertDBuser({username: username, salt: salt, hash: hash});
        insertDBprofile({username: username, displayname: req.body.displayname, email:req.body.email, zipcode:req.body.zipcode, phone: req.body.phone, dob: new Date(req.body.dob)});
        insertDBfollowing({username: username, followlist:[username]});
    
        let msg = {username: username, result: 'success'};
    
        res.send(msg); 
    }
}

function logout(req, res){
    res.clearCookie(cookieKey);
    res.clearCookie("username");
    req.logout();
    res.send("OK");
}

async function insertDBuser(obj){
    const newuser=await (connector.then(()=> {
        return new User({username: obj.username, salt: obj.salt, hash: obj.hash, created: Date.now()})}));
    newuser.save();
}

async function insertDBprofile(obj){
    const newprofile=await (connector.then(()=> {
        return new Profile({username: obj.username, displayname: obj.displayname, headline: "I am new", email:obj.email, zipcode:obj.zipcode, phone: obj.phone, dob: obj.dob, avatar: "https://res.cloudinary.com/hzwltjyu9/image/upload/v1607016549/owllogo_om0gab.png"})}));
    newprofile.save();
}

async function insertDBfollowing(obj){
    const newfollowing=await (connector.then(()=> {
        return new Following({username: obj.username, followlist: obj.followlist})}));
    newfollowing.save();
}

async function passwordfunc(req, res){

    let user = await(getUser(req.username));
    user=user[0];
    let updated={username:user.username, salt:user.salt, hash: md5(user.salt + req.body.password)};

    updateDBpassword(updated);

    res.send({username: updated.username, result: 'password changed'});
}

async function updateDBpassword(obj){
    let temp=await(deleteUser(obj.username));
    const newuser=await (connector.then(()=> {
        return new User({username: obj.username, salt: obj.salt, hash: obj.hash, created: Date.now()})}));
    newuser.save();
}


async function getUser(target){
    let found=await (connector.then(()=> {
        return User.find({username: target})}));
    return found;
}

async function deleteUser(target){
    let found=await (connector.then(()=> {
        return User.deleteOne({username: target})}));
    return found;
}

async function unlinkfb(req, res){
    let user=await (connector.then(()=> {
        return User.updateOne({username: req.cookies["username"]}, {$set: {oauth: [{"facebook": ""}]}})}));
    res.send("done");
}

module.exports = (app) => {
    app.post('/login', login);
    app.post('/register', register);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', passwordfunc);
    app.put('/unlinkfb', unlinkfb);
}

