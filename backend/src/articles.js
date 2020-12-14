const mongoose = require('mongoose');
const articleSchema = require('./articleSchema');
const Article = mongoose.model('article', articleSchema);
const followingSchema = require('./followingSchema');
const Following = mongoose.model('following', followingSchema);
const connectionString = 'mongodb+srv://kiraliu7:972015@cluster0.cpc2c.mongodb.net/social?retryWrites=true&w=majority';
const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const uploadImage = require('./uploadCloudinary')


//FIND ARTICLES THAT MEET THE CRITERIA
async function lookuparticle(dummy, user){
    let followingObj=await (connector.then(()=> {
        return Following.findOne({username: user})}));
    let target=followingObj.followlist;
    let articleTemp=await (connector.then(()=> {
        return Article.find({author: {$in : target}}).sort({date:-1}).limit(10);
    }));
    return articleTemp;
}

async function getListLength(){
    let alistCount=await(connector.then(()=> {
        return Article.aggregate([{$count: "pid"}])}));
    return alistCount[0].pid;
}

async function findArticleById(target){
    let articleObj=await(connector.then(()=> {
        return Article.findOne({pid: target})}));
    return articleObj;
}


async function getarticles(req, res){
    let articleTemp=await lookuparticle("", req.username);
    result=[];
    if(!req.params.id){
        res.send(articleTemp);
    }

    else if(!isNaN(req.params.id)){
        findArticleById(req.params.id).then(ele=> res.send(ele));
    }

    else{
        result=[];
        let target=req.params.id.toLowerCase();
        articleTemp.forEach(ele => {
            if(ele.author.toLowerCase()==target){
                result.push(ele);
            }});
        if(result.length==0){
            res.send("Requested Article Not Found");
        }
        else{
            res.send({articles: result});
        }
    }
}

async function putarticles(req, res){
    let body=req.body;
    let article=await findArticleById(req.params.id).then(ele=> {return ele});
    if(article==null){
        res.send("Invalid Post: Post Not Found");
    }
    else{
        if(!body.commentId && body.commentId!=0){
            if(req.username==article.author){
                let newarticle={...article._doc, text: body.text};
                updateArticle(newarticle);
                res.send(newarticle);
            }
            else{
                res.send("You are not authorized to edit this post");
            }
        }
        else if(body.commentId==-1){
            let comments=article.comments;
            let newcomment={comment: body.text, author: req.username, cid: comments.length};
            comments.push(newcomment);
            let newarticle={...article._doc, comments:comments};
            updateArticle(newarticle);
            res.send(newarticle);    
        }
        else{
            let comments=article.comments;
            let cid=parseInt(body.commentId)
            let thiscomment=comments[cid];
            if(req.username==thiscomment.author){
                let comments=article.comments;
                let newcomment={comment: body.text, author: req.username, cid: body.commentId};
                comments[body.commentId]=newcomment;
                let newarticle={...article._doc, comments:comments};
                updateArticle(newarticle);
                res.send(newarticle);
            }
            else{
                res.send("You are not authorized to edit this comment");
            }
        }
    }
    //res.send("Not yet implemented");
}

async function postarticles(req, res){
    
    let article=await getListLength().then(ele=>{
        return {id: ele, author: req.username, text: req.body.text, date: Date.now(), comments:[], title: req.body.title, img: req.body.img};
    });
    
    //
    //let article = {id: articleLocal.length, author: req.username, text: post.text, date: Date.now(), comments:[]};
    insertDBarticle(article).then(ele=>
        {res.send(ele);}
    )
    //res.send({newarticle: article, status: "posted"});
}

async function insertDBarticle(obj){
    const newaeticle=await (connector.then(()=> {
        return new Article({ pid: obj.id, author: obj.author, text: obj.text, date: obj.date, comments: obj.comments, title: obj.title, img: obj.img })}));
    let dummy=await newaeticle.save();
    let articleTemp=await lookuparticle(dummy, obj.author);
    return articleTemp;
}

async function addcomment(req, res){
    let article=await findArticleById(req.params.id).then(ele=> {return ele});
    let comments=article.comments;
    let newcomment={comment: req.body.comment, author: req.username, cid: comments.length};
    comments.push(newcomment);
    let newarticle={...article._doc, comments:comments};
    updateArticle(newarticle);
    res.send(newarticle);
}

async function editarticle(req, res){
    let article=await findArticleById(req.params.id).then(ele=> {return ele});
    let newarticle={...article._doc, text: req.body.text};
    updateArticle(newarticle);
    res.send(newarticle);
}

async function editcomment(req, res){
    let article=await findArticleById(req.params.pid).then(ele=> {return ele});
    let comments=article.comments;
    let newcomment={comment: req.body.comment, author: req.username, cid: req.params.cid};
    comments[req.params.cid]=newcomment;
    let newarticle={...article._doc, comments:comments};
    updateArticle(newarticle);
    res.send(newarticle);
}

async function updateArticle(obj){
    let temp=await(deleteArticle(obj.pid));
    const newarticle=await (connector.then(()=> {
        return new Article(obj)}));
    newarticle.save();
}

async function deleteArticle(target){
    let found=await (connector.then(()=> {
        return Article.deleteOne({pid: target})}));
    return found;
}

function sendArticlepic(req, res){
    if(!req.fileurl){
        res.send("cant get img url");
    }
    else{    
        res.send({fileurl: req.fileurl});
    }

}

module.exports = (app) => {
    app.get('/articles/:id?', getarticles);
    app.put('/articles/:id', putarticles);
    app.post('/article', postarticles);
    app.put('/articlepic', uploadImage('articlepic'), sendArticlepic)
}