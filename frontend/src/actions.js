/*
 * action types
 */

export const SETUP = "SETUP";
export const NEWUSER = "NEWUSER";
export const REQUEST_POST = "REQUEST_POST";
export const UPDATE_POST = "UPDATE_POST";
export const LOGOUT = "LOGOUT";
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";
export const UPDATE_PROFILE="UPDATE_PROFILE";
export const UPDATE_PWORD="UPDATE_PWORD";
export const UPDATE_USERS="UPDATE_USERS";

//expost const ="";

/*
 * action creator
 */
export function newuser(user) {
    return {type: NEWUSER, user}
}


export function setup(data) {
    return {type: SETUP, data}
}

export function requestPost(post) {
    return {type: REQUEST_POST, post}
}

export function updatePost(post) {
    return {type: UPDATE_POST, post}
}

export function logout(user) {
    return {type: LOGOUT, user}
}

export function login(user) {
    return {type: LOGIN, user}
}

export function register(user){
    return {type: REGISTER, user}
}

export function updateProfile(currentUser){
    return {type: UPDATE_PROFILE, currentUser}
}

export function updateUsers(currentUser){
    return {type: UPDATE_USERS, currentUser}
}

export function updatePword(currentUser){
    return {type: UPDATE_PWORD, currentUser}
}

