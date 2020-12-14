import React from "react";
import { connect } from 'react-redux';
import {requestPost, updatePost} from "./actions";
import Newcomment from "./newcomment";
import Editarticle from "./editarticle";
import Editcomment from "./editcomment";

class Feeds extends React.Component {
    
    constructor(props) {
        super(props);
        /**
         * let allpost=JSON.parse(localStorage.getItem("post"));
        let currentUser=JSON.parse(localStorage.getItem("currentuser"));
        let followedpost=[];
        allpost.map(ele=>{
            if(currentUser.following.includes(ele.userId)||ele.userId==currentUser.userId){
                followedpost.push(ele);
            }
        });
        */
        this.state={
            //post: [],
            displayedpost:[],
            followedcopy:[]
        }
        this.doSearch=this.doSearch.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount(){
        //console.log(this.props.followedpost);
        //this.setState({post: this.props.followedpost, displayedpost:this.props.followedpost, followedcopy:this.props.followedpost});

        fetch("https://zlic16.herokuapp.com/articles", {
            method: 'GET', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(res => res.json())
          .then(
            (result) => {
                this.setState({displayedpost:result, followedcopy:result})
            },
            (error) => {
                console.log(error)

            }
        )
    }

    doSearch(event){
        let searching=event.target.value.toLowerCase();
        let result=[];
        if(searching==""){
            this.setState({displayedpost: this.state.followedcopy});
        }
        else{
            this.state.followedcopy.forEach(ele=>{
                if(ele.title.toLowerCase().includes(searching) || ele.text.toLowerCase().includes(searching) || ele.author.toLowerCase().includes(searching)){
                    result.push(ele);
                }
                })
            this.setState({displayedpost: result});
        }
    }

    handleSubmit(event){

        event.preventDefault();
        let file=document.getElementById('articlepic').files[0];
        if(!file){
            let payload={text:event.target.text.value, title: event.target.title.value, img: null};
            fetch("https://zlic16.herokuapp.com/article", {
                method: 'POST', 
                credentials: 'include', 
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) 
              })
              .then(res => {
                res.json()
              .then(
                (result) => {
                    console.log(result);
                    document.getElementById('articlepic').value=null;
                    window.location.reload(false);
                },
                (error) => {
                    console.log(error);
                }
            )})
        }
        else{
            let formData=new FormData();
            let picname=event.target.title.value.slice(0, 10)+Date.now().toString();
            let payload={text:event.target.text.value, title: event.target.title.value, img: null}
            formData.append("image", file);
            formData.append("articlepic", picname);
            fetch("https://zlic16.herokuapp.com/articlepic", {
                method: 'PUT', 
                credentials: 'include', 
                body: formData
              })
              .then(res => {
                res.json()
              .then(
                (result) => {
                    payload.img=result.fileurl;
                    fetch("https://zlic16.herokuapp.com/article", {
                        method: 'POST', 
                        credentials: 'include', 
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload) 
                      })
                      .then(res => {
                        res.json()
                      .then(
                        (result) => {
                            window.location.reload(false);
                        },
                        (error) => {
                            console.log(error);
                        }
                    )})
                },
                (error) => {
                    this.setState({errormsg:"Failed to update"})
                }
            )})
        }
         
    }


    convertDate(epoch){
        return new Date(epoch);
    }

    render(){
        return (
            <div>
                <div>
                <h3>Make new post</h3>
                    <form id="makenewpost" onSubmit={this.handleSubmit}>
                        <span className="bold">Title: <input type="text" size="50" id="title" placeholder="title" required/></span>
                        <br/>
                        <br/>
                        <textarea id="text" placeholder="write something" rows="10" cols="60" required/>  
                        <br/>
                        <input type="file" id="articlepic" accept="image/*"/>
                        <br/>
                        <br/>
                        <input type="hidden" name="timestamp" id="timestamp" value=""/>
                        <input className="btn btn-secondary" type="submit" value="post"/>
                        &nbsp;&nbsp;
                        <input className="btn btn-secondary" type="reset" value="clear"/>
                    </form>
                </div>
                <br/>
                <h3>Search posts</h3>
                <input size="75" id="articlesearch" type="text" placeholder="search by user or content" onChange={this.doSearch}/>

                {this.state.displayedpost.map(ele=>{
                    return(
                    <div className="post" key={ele.pid}>
                        <br/>
                        <p className="bold">{ele.author}: {ele.title}</p>
                        <div id={"text"+ele.pid}>
                        <p>{ele.text}</p>
                        </div>
                        {ele.img!=null &&
                        <div className="imgbox"> 
                            <img src={ele.img}></img>
                            <br/>
                        </div>}
                        <span>Posted on: {this.convertDate(ele.date).toString()}</span>
                        <br/>
                        <br/>
                        {/*<input className="btn btn-secondary" type="button" value="Edit" />
                        &nbsp;&nbsp;

                        <input className="btn btn-secondary" type="button" value="Comment" onClick={this.newComment}/>
                        &nbsp;&nbsp;*/}
                        <Editarticle currentUsername={this.props.currentUsername} article={ele}/>
                        <Newcomment currentUsername={this.props.currentUsername} article={ele}/>

                        <details className="comments">
                            <summary>Comments:</summary>
                            {ele.comments.map(elee=>{
                                return(
                                    <div key={elee.cid}>
                                        <span>{elee.author}:&nbsp;&nbsp;{elee.comment}</span>
                                        <Editcomment currentUsername={this.props.currentUsername} article={ele} comment={elee}/>
                                    </div>
                                )
                            })}
                        </details>
                    </div>)})}
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {

        //currentUser: state.currentUser,
        //post: state.post
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        //updatePost: (post) => dispatch(updatePost(post)),
        //requestPost: (players) => dispatch(requestPost(players))

        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
