import {Link} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import {  updateProfile, updateUsers , logout} from "./actions";
import Feeds from './feeds';
import Following from './following';
import Banner from './banner';

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            //status:this.props.currentUser.status,
            //status:JSON.parse(localStorage.getItem("currentuser")).status,
            //firstload: true, 
            currentUser:{},
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
    }

    componentDidMount(){
        fetch("https://zlic16.herokuapp.com/profile", {
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
                this.setState({currentUser: result})
            },
            (error) => {
                console.log(error)

            }
            )
        
    }


    handleLogout(event){
        fetch("https://zlic16.herokuapp.com/logout", {
            method: 'PUT', 
            credentials: 'include', 
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(res => {
            res.json()
          .then(
            (result) => {
                
            },
            (error) => {
                
            }
        )}).then(()=>{
            this.props.logout(event);
            window.location="/";
        })
    }



    handleSubmit(event){
        event.preventDefault();

        let payload={headline: event.target.newheadline.value};
        fetch("https://zlic16.herokuapp.com/headline", {
            method: 'PUT', 
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
                this.setState({...this.state.currentUser, headline:payload.headline});
            },
            (error) => {
                console.log(error);
            }
        )})

        event.target.newheadline.value="";
        window.location.reload(false);
    }

    render(){
        return (
            <div className="main">
                <div>
                    <div>
                        <Banner/>
                    </div>
                    <br/>
                    <Link to={"/profile"} className="link">
                        <input className="btn btn-dark" type="button" value="To Profile"/>
                    </Link>

                    <div>
                        <br/>
                        <img src={this.state.currentUser.avatar} width="150" height="150"/>
                        <br/>
                        <span className="bold">{this.state.currentUser.displayname}</span> 
                        <br/>
                        <span>{this.state.currentUser.headline}</span> 
                        <br/>
                        <div>
                            <form id="statusform" onSubmit={this.handleSubmit}>
                            <input type="text" id="newheadline" placeholder="New headline"/>
                            &nbsp;&nbsp;
                            <input className="btn btn-secondary btn-sm" type="submit" value="update"/>
                            </form>
                        </div>
                    </div>

                    <br/>
                    <div>
                        <h3>Following</h3>
                        <Following />
                    </div>
                </div>
                <div>
                    <div className="logout">
                        <input className="btn btn-dark" id="logoutbtn" type="button" value="Log out" onClick={this.handleLogout}/>
                    </div>
                    <div> 
                        <Feeds currentUsername={this.state.currentUser.username} />
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        //currentUser: state.currentUser,
        loggedin: state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        //updateProfile: (p) => dispatch(updateProfile(p)),
        //updateUsers:(p) => dispatch(updateUsers(p)),
        logout: (c) => dispatch(logout(c)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
