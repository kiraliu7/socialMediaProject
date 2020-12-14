
const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://kiraliu7:972015@cluster0.cpc2c.mongodb.net/social?retryWrites=true&w=majority';
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const uploadImage = require('./uploadCloudinary')

//let profileObj = {};

async function insertDBprofile(obj){
    const newprofile=await (connector.then(()=> {
        return new Profile({username: obj.username, displayname: obj.displayname, headline: obj.headline, email: obj.email, zipcode: obj.zipcode,dob: obj.dob, avatar: obj.avatar, phone: obj.phone})}));
    newprofile.save();
}

async function updateDBprofile(obj){
    let temp=await(deleteProfile(obj.username));
    const newprofile=await (connector.then(()=> {
        return new Profile({username: obj.username, displayname: obj.displayname, headline: obj.headline, email: obj.email, zipcode: obj.zipcode,dob: obj.dob, avatar: obj.avatar, phone: obj.phone})}));
    newprofile.save();

}

async function deleteProfile(target){
    let found=await (connector.then(()=> {
        return Profile.deleteOne({username: target})}));
    return found;
}


async function lookupprofile(dummy, target){
    let profileObj=await (connector.then(()=> {
        return Profile.findOne({username: target})}));
    return profileObj;
}

async function getheadline(req, res){

    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, headline: profileObj.headline})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, headline: temp.headline}) ;
        }
        else{
            res.send("User does not exist");
        }
    }
}

async function putheadline(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: user.displayname, headline: post.headline, email: user.email, zipcode: user.zipcode,dob: user.dob, avatar: user.avatar, phone: user.phone};
    updateDBprofile(newuser);

    res.send({username: newuser.username, headline: newuser.headline});
}

async function getemail(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, email: profileObj.email})})       
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, email: temp.email}) ;
        }
        else{
            res.send("User does not exist");
        }
    }
}

async function putemail(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: user.displayname, headline: user.headline, email: post.email, zipcode: user.zipcode,dob: user.dob, avatar: user.avatar, phone: user.phone};
    updateDBprofile(newuser);

    res.send({username: newuser.username, email: newuser.email});
}

async function getdob(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, dob: profileObj.dob})})
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, dob: temp.dob}) ;
        }
        else{
            res.send("User does not exist");
        }
    }
}

async function getzipcode(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, zipcode: profileObj.zipcode})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, zipcode: temp.zipcode}) ;
        }
        else{
            res.send("User does not exist");
        }
    } 
}

async function putzipcode(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: user.displayname, headline: user.headline, email: user.email, zipcode: post.zipcode,dob: user.dob, avatar: user.avatar, phone: user.phone};
    updateDBprofile(newuser);

    res.send({username: newuser.username, zipcode: newuser.zipcode});
}

async function getavatar(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, avatar: profileObj.avatar})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, avatar: temp.avatar}) ;
        }
        else{
            res.send("User does not exist");
        }
    } 
}


async function getphone(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, phone: profileObj.phone})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, phone: temp.phone}) ;
        }
        else{
            res.send("User does not exist");
        }
    } 
}

async function putphone(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: user.displayname, headline: user.headline, email: user.email, zipcode: user.zipcode,dob: user.dob, avatar: user.avatar, phone: post.phone};
    updateDBprofile(newuser);

    res.send({username: newuser.username, phone: newuser.phone});
}

async function getdisplayname(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, displayname: profileObj.displayname})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, displayname: temp.displayname}) ;
        }
        else{
            res.send("User does not exist");
        }
    } 
}

async function putdisplayname(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: post.displayname, headline: user.headline, email: user.email, zipcode: user.zipcode,dob: user.dob, avatar: user.avatar, phone: user.phone};
    updateDBprofile(newuser);

    res.send({username: newuser.username, displayname: newuser.displayname});
}

async function updateprofile(req, res){
    let post=req.body;
    let user=await (connector.then(()=> {
        return Profile.find({username : req.username})}));
    user=user[0];
    let newuser={username: user.username, displayname: post.displayname, headline: user.headline, email: post.email, zipcode: post.zipcode,dob: user.dob, avatar: user.avatar, phone: post.phone};
    updateDBprofile(newuser);

    res.send({username: post.username, displayname: post.displayname, headline: post.headline, email: post.email, zipcode: post.zipcode,dob: post.dob, avatar: post.avatar, phone: post.phone});
}

async function getprofile(req, res){
    if(!req.params.user){
        lookupprofile("", req.username).then(profileObj=>
            {res.send({username: profileObj.username, displayname: profileObj.displayname, headline: profileObj.headline, email: profileObj.email, zipcode: profileObj.zipcode,dob: profileObj.dob, avatar: profileObj.avatar, phone: profileObj.phone})})
        
    }
    else{
        let profileObj=await (connector.then(()=> {
            return Profile.findOne({username: req.params.user.toLowerCase()})}));
        if(profileObj){
            res.send({username: profileObj.username, displayname: profileObj.displayname, headline: profileObj.headline, email: profileObj.email, zipcode: profileObj.zipcode,dob: profileObj.dob, avatar: profileObj.avatar, phone: profileObj.phone}) ;
        }
        else{
            res.send("User does not exist");
        }
    } 
}

async function putAvatar(req, res){
    if(!req.fileurl){
        res.send("cant get img url");
    }
    else{
        let user=await (connector.then(()=> {
            return Profile.find({username : req.username})}));
        user=user[0];
        let newuser={username: user.username, displayname: user.displayname, headline: user.headline, email: user.email, zipcode: user.zipcode,dob: user.dob, avatar: req.fileurl, phone: user.phone};
        updateDBprofile(newuser);
    
        res.send({username: newuser.username, avatar: newuser.avatar});
    }

}

module.exports = (app) => {
    app.get('/headline/:user?', getheadline);
    app.put('/headline', putheadline);
    app.get('/email/:user?', getemail);
    app.put('/email', putemail);
    app.get('/dob/:user?', getdob);
    app.get('/zipcode/:user?', getzipcode);
    app.put('/zipcode', putzipcode);
    app.get('/avatar/:user?', getavatar);
    app.put('/avatar', uploadImage('avatar'), putAvatar)
    app.get('/phone/:user?', getphone);
    app.put('/phone', putphone);
    app.get('/displayname/:user?', getdisplayname);
    app.put('/displayname', putdisplayname);
    app.put("/updateprofile", updateprofile);
    app.get("/profile/:user?", getprofile);
}