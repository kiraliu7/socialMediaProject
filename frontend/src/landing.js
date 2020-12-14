import React from "react";
import { connect } from 'react-redux';
import { setup } from "./actions";
import Register from './register';
import Login from './login';
import Banner from './banner';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        
    }


    componentDidMount() {
        //if(this.props.post.length==0){
        //fetch(`https://jsonplaceholder.typicode.com/posts`).then(res => res.json()).then(res =>
        //    this.props.requestPost(res)
            
        //);
        
        //}
        //fetch("./placeholder.json").then(res => res.json()).then(res =>
        //    this.props.requestPost(res));
        //fetch("./placeholder.json").then(res => res.json()).then(res =>
        //    console.log(res));
        if(localStorage.getItem("setup")=="on"){
            return;
        }
        else{
            let data=require("./placeholder.json");
            this.props.setup(data); 
        }
    }
    render(){
        return (
            <div className="bg">
                <div className="twoColWrapper">
                    <div className="loginblock">
                        <div>
                            <Banner/>
                        </div>
                        <div className="login">
                            <Login/>
                        </div>
                    </div>
                    <div className="registerblock">
                        <div className="register">
                        <Register/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setup: (players) => dispatch(setup(players))        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Landing);
