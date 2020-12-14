import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updateUsers } from "./actions";

class Following extends React.Component {

    constructor(props) {
        super(props);
        this.handleunfollow=this.handleunfollow.bind(this);
        this.handlefollow=this.handlefollow.bind(this);
        this.state={
            //followlist:this.props.currentUser.following, 
            followlist:[],
            detailedfollowlist:[],
            errormsg:""
        }
        this.detailfollowing=this.detailfollowing.bind(this);
    }

    componentDidMount(){
        fetch("https://zlic16.herokuapp.com/following", {
            method: 'GET', 
            //mode: 'cors', 
            //cache: 'no-cache', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            //redirect: 'follow', 
          })
          .then(res => res.json())
          .then(
            (result) => {
                this.setState({followlist: result.following})
                result.following.slice(1).map(ele=>{
                    this.detailfollowing(ele);
                })
            },
            (error) => {
                console.log(error)

            }
            )
    }

    handlefollow(event){
        event.preventDefault();
        
        let url="https://zlic16.herokuapp.com/following/"+event.target.tofollow.value;


        fetch(url, {
            method: 'PUT', 
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
          })
          .then(res => {
            let temp=res.clone();
            res.json()
          .then(
            (result) => {
                {this.setState({errormsg:""})}
                window.location.reload(false);
            },
            (error) => {
                temp.text().then(text=>{this.setState({errormsg:text})});
            }
        )})
        
        /** 
        let newfollowlist=this.state.followlist;
        let checkuser=JSON.parse(localStorage.getItem("userlist")).find(
            (item)=>{return item.username==event.target.tofollow.value});
        if(checkuser==null){
            this.setState({errormsg: "User not found"});
        }
        else if(checkuser.userId==JSON.parse(localStorage.getItem("currentuser")).userId){
            this.setState({errormsg: "You cannot follow yourself"});
        }
        else if(this.state.followlist.includes(checkuser.userId)){
            this.setState({errormsg: "User already followed"});
        }
        else{
            newfollowlist.push(checkuser.userId);
            this.setState({followlist:newfollowlist, errormsg: ""});
            let updated={...JSON.parse(localStorage.getItem("currentuser")), following:newfollowlist};
            this.props.updateProfile(updated);
            this.props.updateUsers(updated);
            this.props.handleChangeFollow(newfollowlist);
            window.location.reload(false);
        }
        */
        event.target.tofollow.value="";
    }

    handleunfollow(event){
        console.log(event.target.name);
        let url="https://zlic16.herokuapp.com/following/"+event.target.name;
        fetch(url, {
            method: 'DELETE', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }, 
          })
          //.then(res => res.text().then(text=>{this.setState({errormsg:text})}))
          .then(res => res.json())
          .then(
            (result) => {
                window.location.reload(false);
            },
            (error) => {
                console.log(error)
            }
        )
        
        
    }

    detailfollowing(target){
        let url="https://zlic16.herokuapp.com/profile/"+target;
        let temp=this.state.detailedfollowlist;
        fetch(url, {
            method: 'GET', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }, 
          })
          .then(res => res.json())
          .then(
            (result) => {
                temp.push(result);
                this.setState({detailedfollowlist: temp});
            },
            (error) => {
                console.log(error)
            }
        )
    }

    render(){
        return (
            <div>
                <div>
                    <form id="followform" onSubmit={this.handlefollow}>
                        <input type="text" id="tofollow" placeholder="Add user by username"/>
                        &nbsp;&nbsp;
                        <input className="btn btn-secondary btn-sm" type="submit" value="follow" />
                        <p>{this.state.errormsg}</p>
                    </form>
                </div>
                {this.state.detailedfollowlist.map((ele)=>{
                    return(
                    <div key={ele.username}>
                        <img src={ele.avatar} width="150" height="150"/>
                        <br/>
                        <br/>
                        <div>
                        <span className="bold">{ele.displayname}</span>
                        &nbsp;&nbsp;
                        <input className="btn btn-dark btn-sm" type='button' value="unfollow" id={"unfollow"+ele.username} name={ele.username} onClick={this.handleunfollow}/>
                        </div>
                        <div>{ele.headline}</div>
                        <br/>
                    </div>)})}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        userlist: state.userlist
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (c) => dispatch(updateProfile(c)),
        updateUsers: (c) => dispatch(updateUsers(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Following);
