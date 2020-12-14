import {REQUEST_POST, LOGOUT, LOGIN, UPDATE_POST, UPDATE_PROFILE, UPDATE_USERS, UPDATE_PWORD, SETUP} from "./actions";

const intialState = {
};

export function socialmediaApp( state = intialState, action) {
    switch (action.type) {
        case SETUP:
            //localStorage.setItem("currentuser", JSON.stringify(action.data.currentUser));
            //localStorage.setItem("userlist", JSON.stringify(action.data.userlist));
            //localStorage.setItem("userpassword", JSON.stringify(action.data.userpassword));
            //localStorage.setItem("post", JSON.stringify(action.data.post.reverse()));
            //localStorage.setItem("setup", "on");
            //localStorage.setItem("loggedin", JSON.stringify(false));
            return {loggedin: false};
        case REQUEST_POST:
            //let postlist=[];
            //action.post.map(ele=>
            //    {ele={...ele, img: "https://riceowls.com/images/2017/5/1/rice-head.jpg"}
            //    postlist.push(ele)});
            return {...state};
        case LOGIN:
            //localStorage.setItem("currentuser", JSON.stringify(action.user));
            //localStorage.setItem("loggedin", JSON.stringify(true));
            return {...state, currentUser: action.user, loggedin: true};
        case LOGOUT:
            //localStorage.setItem("currentuser", JSON.stringify({"userId":0, "username":null, "displayname":"dummy", "email": null, "phone":null, "zip":null, "img":null, "following":[], "status": null}));
            //localStorage.setItem("loggedin", JSON.stringify(false));
            //return {...state, loggedin: false, currentUser: {"userId":0, "username":null, "displayname":"dummy", "email": null, "phone":null, "zip":null, "img":null, "following":[], "status": null}};
            return {loggedin: false};
        case UPDATE_PROFILE:
            //localStorage.setItem("currentuser", JSON.stringify(action.currentUser));
            return {...state};
        case UPDATE_USERS:
            //let newuserlist=JSON.parse(localStorage.getItem("userlist"));
            //if(action.currentUser.userId!=null){
            //    newuserlist.splice(action.currentUser.userId-1, 1, action.currentUser);
            //}
           // else{
           //     let newuser={...action.currentUser, userId:newuserlist.length+1};
           //     newuserlist.push(newuser);
            //}
            //localStorage.setItem("userlist", JSON.stringify(newuserlist));
            return {...state};
        case UPDATE_PWORD:
           // let newuserpassword=JSON.parse(localStorage.getItem("userpassword"));
            //let toUpdate=null;
            //if(action.currentUser.userId!=null){
            //    toUpdate={...newuserpassword[action.currentUser.userId-1], password:action.currentUser.password};
           //     newuserpassword.splice(action.currentUser.userId-1, 1, toUpdate)
            //}
            //else{
            //    let newuser={...action.currentUser, userId:newuserpassword.length+1};
            //    newuserpassword.push(newuser);
            //}
            //localStorage.setItem("userpassword", JSON.stringify(newuserpassword));
            return {...state}
        case UPDATE_POST:
            //localStorage.setItem("post", JSON.stringify(action.post));
            return {...state};
        default:
            return state;
    }
}
