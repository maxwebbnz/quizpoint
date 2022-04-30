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


function setUserObjectLocal(_userObj) {
    _userObj.authed = true
    sessionStorage.setItem('user', JSON.stringify(_userObj));
    window.location.reload(false);
}

export {
    setUserObjectLocal,
    user
}