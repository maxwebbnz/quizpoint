/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



let user = {
    authed: false
};

if (sessionStorage.user === undefined) {
    user.authed = false;
} else {
    user = JSON.parse(sessionStorage.user);
}


function setUserObjectLocal(_userObj, _token) {
    _userObj.authed = true
    _userObj.accessToken = _token
    sessionStorage.setItem('user', JSON.stringify(_userObj));
    window.location.reload(false);
}

export {
    setUserObjectLocal,
    user
}