/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



let user =  {
    authed: false
};

if(sessionStorage.user === undefined){
    user.authed = false;
}else{
user = JSON.parse(sessionStorage.user);

}


function setUserObjectLocal(_userObj){
    sessionStorage.setItem('user', JSON.stringify(_userObj));
    user.authed = true
        window.location.reload(false);

}

export {
    setUserObjectLocal,
    user
}