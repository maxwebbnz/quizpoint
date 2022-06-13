/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



/**========================================================================
 **                           User Module
 *?  What does it do? Handles user authentication and data management
 *@return object
 *========================================================================**/
// by default, user is not authed
let user = {
    authed: false
};

// if session storage -> empty
if (sessionStorage.user === undefined) {
    user.authed = false;

    // if user is authed, get user data from session storage
} else {
    user = JSON.parse(sessionStorage.user);

}


/**==============================================
 **              setUserObjectLocal
 *?  What does it do? Sets user object in local storage
*@param _userObject
*@param _token
 *@return type
 *=============================================**/
function setUserObjectLocal(_userObj, _token) {
    // set auth state
    _userObj.authed = true
    // set google api token
    _userObj.accessToken = _token
    // set user object in session storage
    sessionStorage.setItem('user', JSON.stringify(_userObj));
    // reload page
    window.location.reload(false);

}


//? old code that never worked
// function updateUserData(_newObject) {
//     let oldData = user;
//     user = _newObject
//     sessionStorage.setItem('user', JSON.stringify(user));
//     window.location.reload(false);
//     console.log('User updated from ', oldData, ' to ', user);
// }

// export functions
export {
    setUserObjectLocal,
    user
}