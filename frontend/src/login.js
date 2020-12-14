import {Redirect} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import {login} from "./actions";
import cookie from 'react-cookies';

//////////////////////////TRY USE FETCH TO USE CORS

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.state={
            errormsg:"",
            loggedin:false
        }
    }
    handleSubmit(event){
        event.preventDefault();
        let payload={username: event.target.username.value, password: event.target.pword.value};
        fetch("https://zlic16.herokuapp.com/login", {
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
                this.setState({errormsg:"", loggedin: true})
                fetch("https://zlic16.herokuapp.com/profile", {
                    method: 'GET', 
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                  })
                  .then(res => res.json())
                  .then(
                    (result) => {
                        this.props.login(result);
                    },
                    (error) => {
                        console.log(error)
        
                    }
                    )
            },
            (error) => {
                this.setState({errormsg:"Unrecognized Combination of username and password"})
            }
        )})      
        
    }



    render(){
        if(this.state.loggedin){
            return <Redirect to='/main' />            
        }
        return (
            <div>
                <div className="container">
                    <h1>Login</h1>
                        <form id="loginform" onSubmit={this.handleSubmit}>
                            <p>Username: <br/> <input type="text" name="username" id="username" placeholder="enter username"  required/>  </p>
                            <p>Password: <br/> <input type="password" name="pword" id="pword" placeholder="enter password" required/>  </p>
                            <input type="hidden" id="logintimestamp" value=""/>
                            <input className="btn btn-secondary" type="submit" id="loginsubmit" value="login"/>
                            <p>{this.state.errormsg}</p>
                        </form>
                </div>
                <br/>
                <div className="container">
                    <a href={"http://localhost:8080" + "/auth/facebook"}>
                        <input className="btn btn-primary" type="button" value="Facebook Login" />
                    </a>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        //userpassword: state.userpassword,
        //userlist:state.userlist,
        loggedin:state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (c) => dispatch(login(c)),
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);
