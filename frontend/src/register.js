import {Redirect} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updatePword, updateUsers} from "./actions";
//import {buttons} from "react-materialize"


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.state={
            errormsg:``,
            error:``,
            loggedin: false
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    
    handleSubmit(event){
        event.preventDefault();
        let bday=new Date(event.target.bday.value);
        var currentdate=new Date();
        var age = currentdate.getFullYear() - bday.getFullYear();
        var m = currentdate.getMonth() - bday.getMonth();
        if (m < 0 || (m === 0 && currentdate.getDate() < bday.getDate())) {age--;}
      
        let newusername=event.target.rusername.value;
        let newemail=event.target.emailaddress.value;
        let newphone=event.target.phonenum.value;
        let newzip=event.target.zipcode.value;
        let newpword=event.target.rpword.value;
        let newpwordconfirm=event.target.pwordconfirm.value;
        
        if(age<18){
            this.setState({errormsg:"You need to be 18 years old to register."});
            return;
        }

        if(!/^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]*$/.test(newemail)){
            this.setState({errormsg:"Invalid email"});
            return;
        }

        if(!/^[0-9]{5}(?:-[0-9]{4})?$/.test(newzip)){
            this.setState({errormsg:"Invalid zipcode"});
            return;
        }

        if(!/^[0-9]{10}$/.test(newphone)){
            this.setState({errormsg:"Invalid phone number"});
            return;
        }

        if(newpword!=newpwordconfirm){
            this.setState({errormsg:"Passwords do not match"});
            return;
        }
        
        let payload={username: newusername, password: newpword, displayname: event.target.disname.value, email: newemail, zipcode: newzip, dob: bday, phone: newphone};
        fetch("https://zlic16.herokuapp.com/register", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            credentials: 'include', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) 
          })
          .then(res => {
            let temp=res.clone();
            res.json()
          .then(
            (result) => {
                this.setState({errormsg:""})
                
                fetch("https://zlic16.herokuapp.com/login", {
                method: 'POST', 
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) 
                }).then(res=>{this.setState({loggedin: true})})
                
            },
            (error) => {
                temp.text().then(text=>{this.setState({errormsg:text})});
            }
        )})

    }
    render(){
        if(this.state.loggedin){
            return <Redirect to='/main' />
        }
        return (
            
            <div className="container">
                <h1>Create an account</h1>
                    <form id="registerform" onSubmit={this.handleSubmit}>
                        <p>Username: (Must Start With Character) <br/> <input type="text" id="rusername" placeholder="choose a username" pattern="[a-zA-Z]+[a-zA-Z0-9]*" required/>  </p>
                        <p>Display Name: <br/> <input type="text" id="disname" placeholder="choose a display name" required/>  </p>
                        <p>Birthday: <br/> <input type="date" id="bday" required/> </p>
	                    <p>Email Address: <br/> <input type="email" id="emailaddress" placeholder="abc@example.com" required/> </p>
	                    <p>Phone Number (Expected Format: 0000000000): <br/> <input type="tel" id="phonenum" placeholder="0000000000"  required/> </p>  
                        <p>Zipcode: <br/> <input type="text" id="zipcode" placeholder="enter your zipcode" required/>  </p>
                        <p>Password: <br/> <input type="password" id="rpword" placeholder="create a password" required/>  </p>
                        <p>Password Confirmation: <br/> <input type="password" id="pwordconfirm" placeholder="re-enter your password" required/>  </p>
                        <input type="hidden" id="registertimestamp" value=""/>
                        <input className="btn btn-secondary" type="submit" value="create account"/>
                        &nbsp;&nbsp;
                        <input className="btn btn-secondary" type="reset" value="clear input"/>
                        <p>{this.state.error}</p>
                        <p>{this.state.errormsg}</p>
                    </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

        //userlist: state.userlist,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        //updateProfile: (c) => dispatch(updateProfile(c)),
        //updatePword: (c) => dispatch(updatePword(c)),
        //updateUsers: (c) => dispatch(updateUsers(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Register);
