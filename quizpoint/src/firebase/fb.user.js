/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { getDatabase, ref, onValue } from "firebase/database";





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

function updateUserData(_newObject) {
    let oldData = user;
    user = _newObject
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location.reload(false);
    console.log('User updated from ', oldData, ' to ', user);
}

export {
    setUserObjectLocal,
    user,
    updateUserData
}