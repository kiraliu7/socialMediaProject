import {Link} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updateUsers, updatePword, logout} from "./actions";
import Banner from './banner';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            errormsg:``,
            error:``
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
        this.updateDB=this.updateDB.bind(this);
        this.updateDBpword=this.updateDBpword.bind(this);
        this.uploadavatar=this.uploadavatar.bind(this);
        this.unlinkfb=this.unlinkfb.bind(this);
    }

    componentDidMount(){

        fetch("https://zlic16.herokuapp.com/profile", {
            method: 'GET', 
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(
              res => {
                  res.json().then(
                (result) => {
                    this.setState({username: result.username, email: result.email, displayname: result.displayname, phone: result.phone, zipcode: result.zipcode, avatar: result.avatar, dob: result.dob.slice(0,10)})
                },
                (error) => {
                    
                }
                )
            })

        
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
        let newdisname=event.target.disname.value;
        let newemail=event.target.emailaddress.value;
        let newphone=event.target.phonenum.value;
        let newzipcode=event.target.zipcode.value;
        let newpword=event.target.pword.value;
        let newpwordconfirm=event.target.pwordconfirm.value;
        let newerrormsg=``;
        let noupdate=true;
        let updatepword=false;
        let updated={...this.state}
        let valid=true;

        if(newdisname!=""){
            noupdate=false;
            updated={...updated, displayname:newdisname}
        }

        //validate zip
        if(newzipcode!=""){

            if(!/^[0-9]{5}(?:-[0-9]{4})?$/.test(newzipcode)){
                newerrormsg+=`zip,   `;
                valid=false;
            }
            else{
                noupdate=false;
            }
                updated={...updated, zipcode:newzipcode}
        }
        
        
        if(newemail!=""){
            
            if(!/^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]*$/.test(newemail)){
                newerrormsg+=`email,   `;
                valid=false;
            }
            else{
                noupdate=false;               
            }
                updated={...updated, email:newemail}
        }

        if(newphone!=""){
            if(!/^[0-9]{10}$/.test(newphone)){
                newerrormsg+=`phone,   `;
                valid=false;
            }
            else{
                noupdate=false;
            }
                updated={...updated, phone:newphone}
        }

        if(newpword!="" || newpwordconfirm!=""){

            if(newpword!=newpwordconfirm){
                newerrormsg+=`passwords does not match,  `;
                valid=false;
            }
            else{
            noupdate=false;    
            updatepword=true;}
        }
        

        if(!noupdate && valid){
            this.setState({errormsg:``})
            this.setState({error:``})
            this.updateDB(updated);

            if(updatepword){
                this.updateDBpword({password: newpword});
            }
            event.target.disname.value="";
            event.target.emailaddress.value="";
            event.target.phonenum.value="";
            event.target.zipcode.value="";
            event.target.pword.value="";
            event.target.pwordconfirm.value="";
        }
        else{
            
            this.setState({error:`No Input OR invalid inputs detected from:  `})
            this.setState({errormsg: newerrormsg})           
        }
    }

    updateDBpword(payload){
        fetch("https://zlic16.herokuapp.com/password", {
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
                
            },
            (error) => {
                this.setState({errormsg:"Failed to update"})
            }
        )})
    }

    updateDB(payload){
        fetch("https://zlic16.herokuapp.com/updateprofile", {
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
                this.setState({displayname: result.displayname, email: result.email, phone: result.phone, zipcode: result.zipcode});
            },
            (error) => {
                this.setState({errormsg:"Failed to update"})
            }
        )})

    }

    uploadavatar(event){
        event.preventDefault();
        let file=document.getElementById('newavatar').files[0];
        if(!file){
            return;
        }
        else{
            let formData=new FormData();
            formData.append("image", file);
            formData.append("avatar", this.state.username);
            fetch("https://zlic16.herokuapp.com/avatar", {
                method: 'PUT', 
                credentials: 'include', 
                body: formData
              })
              .then(res => {
                res.json()
              .then(
                (result) => {
                    this.setState({avatar: result.avatar});
                    document.getElementById('newavatar').value=null;
                },
                (error) => {
                    this.setState({errormsg:"Failed to update"})
                }
            )})
        }
    }

    unlinkfb(event){
        fetch("https://zlic16.herokuapp.com/unlinkfb", {
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
        )}).then(()=>window.location="/main")
    }

    render(){
        return (
            <div className="bg">
                <div className="twoColWrapper">
                    <div>
                        <div>
                            <Banner/>
                        </div>
                        <br/>
                        <div>
                            <Link to={"/main"} className="link">
                                <input className="btn btn-dark" type="button" value="To Main"/>
                            </Link>
                        </div>
                        <div className="currentinfo">
                        <img src={this.state.avatar} width="150" height="150"/>
                        <br/>
                        <br/>
                        <h3>Current Info</h3>
                        <p id="currentdisname">Display Name: <span className="bold">{this.state.displayname}</span> </p> 
                        <p id="dob">Birthdate: <span className="bold">{this.state.dob}</span> </p> 
                        <p id="currentemail">Email: <span className="bold">{this.state.email}</span></p> 
                        <p id="currentphone">Phone: <span className="bold">{this.state.phone}</span></p>
                        <p id="currentzipcode">Zipcode: <span className="bold">{this.state.zipcode}</span></p>
                        <p id="currentpassword">Password: <span className="bold">*******</span></p>

                        <div>
                             <a href={"http://localhost:8080" + "/auth/facebook"}>
                                <input className="btn btn-primary" type="button" value="Link Facebook Account" />
                            </a>
                        </div>
                        <br/>
                        <div>
                            <input className="btn btn-dark" type="button" value="Unlink Accounts" onClick={this.unlinkfb}/>
                        </div>

                        </div>
                    </div>
                    <div>
                        <div className="logout"> 
                            <input className="btn btn-dark" id="logoutbtn" type="button" value="Log out" onClick={this.handleLogout}/>
                        </div>
                        <div className="changeinfo">

                            <div className="container">
                                <h3>Upload new profile picture</h3>
                                <form id="changeavatar" encType="multipart/form-data" onSubmit={this.uploadavatar}>
                                    <p>
                                    <input id="newavatar" type="file" accept="image/*"/>
                                    </p>
                                    <input className="btn btn-secondary" type="submit" value="upload image"/>
                                </form>
                            </div>

                            <br/>
                            <br/>

                            <div className="container">
                            <h3>Update Info</h3>
                            <form id="update" onSubmit={this.handleSubmit}>
                            <p>Display Name: &nbsp;
                                <input id="disname" type="text" name="disname" placeholder="change display name" />  </p>
                            <p>Email Address: &nbsp;
                                <input id="emailaddress" type="email" name="emailaddress" placeholder="format: ab@c.com" /> </p>
                            <p>Phone Number: &nbsp;
                                <input id="phonenum" type="tel" name="phonenum" placeholder="format: 0000000000 "/> </p>
                            <p>Zipcode: &nbsp;
                                <input id="zipcode" type="text" name="zipcode" placeholder="change zipcode" />  </p>
                            <p>Password: &nbsp;
                                <input id="pword" type="password" name="pword" placeholder="change password" />  </p>
                            <p>Password Confirmation: &nbsp;
                                <input type="password" id="pwordconfirm" name="pwordconfirm" placeholder="confirm new password" />  </p>
                            <input className="btn btn-secondary" type="submit" value="update changes"/>
                            <p>{this.state.error}</p>
                            <p>{this.state.errormsg}</p>
                            </form>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        //userlist: state.userlist,
        //userpassword: state.userpassword,
        loggedin:state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        //updateProfile: (c) => dispatch(updateProfile(c)),
        //updatePword: (c) => dispatch(updatePword(c)),
        //updateUsers: (c) => dispatch(updateUsers(c)),
        logout: (c) => dispatch(logout(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
