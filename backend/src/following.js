const mongoose = require('mongoose');
const followingSchema = require('./followingSchema');
const Following = mongoose.model('following', followingSchema);
const connectionString = 'mongodb+srv://kiraliu7:972015@cluster0.cpc2c.mongodb.net/social?retryWrites=true&w=majority';
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });


async function lookupfollowing(target){
    let followingObj=await (connector.then(()=> {
        return Following.findOne({username: target})}));
    return followingObj;
}


async function updateDBfollowing(obj){
    let temp=await(deleteDBfollowing(obj.username));
    const newfollowing=await (connector.then(()=> {
        return new Following({username: obj.username, followlist: obj.followlist})}));
    newfollowing.save();
}

async function deleteDBfollowing(target){
    let found=await (connector.then(()=> {
        return Following.deleteOne({username: target})}));
    return found;
}

async function getfollowing(req, res){
    if(!req.params.user){
        lookupfollowing(req.username).then(followingObj=>
            {res.send({username: followingObj.username, following: followingObj.followlist})})
        
    }
    else{
        let temp=await (connector.then(()=> {
            return Following.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            res.send({username: temp.username, following: temp.followlist}) ;
        }
        else{
            res.send("User does not exist");
        }
    }
}

async function putfollowing(req, res){
    if(!req.params.user){
        res.send("Invalid Request: No username provided");
    }
    else{
        let temp=await (connector.then(()=> {
            return Following.findOne({username: req.params.user.toLowerCase()})}));
        if(temp){
            let current=await lookupfollowing(req.username).then(ele=> {return ele});
            if(current.followlist.includes(req.params.user)){
                res.send("Invalid Request: Already followed");
            }
            else{
                current.followlist.push(req.params.user);
                updateDBfollowing(current);
                res.send(current);
            }
        }
        else{
            res.send("User does not exist");
        }
    }
}

async function deletefollowing(req, res){
    if(!req.params.user){
        res.send("Invalid Request: No username provided");
    }
    else if(req.params.user==req.username){
        res.send("Invalid Request: Cannot unfollow self");
    }
    else{
        let current=await lookupfollowing(req.username).then(ele=> {return ele});
        let index=current.followlist.indexOf(req.params.user);
        if(index==-1){
            res.send("Invalid Request: User not followed");
        }
        else{
            current.followlist.splice(index, 1);
            updateDBfollowing(current);
            res.send(current);
        }
    }
}

module.exports = (app) => {
    app.get('/following/:user?', getfollowing);
    app.put('/following/:user', putfollowing);
    app.delete('/following/:user', deletefollowing);
}
