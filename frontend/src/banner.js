import React from "react";
import { connect } from 'react-redux';
import owl from "./owllogo.png";

class Banner extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>
                <img src={owl} alt="owl" height="120"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {   
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Banner);
