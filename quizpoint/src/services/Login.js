/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Import Statements
import async from 'async'

import { auth } from "./firebase";
import { setUserObjectLocal } from "../firebase/fb.user"
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { Image, Button } from 'react-bootstrap'
import { useGoogleLogout } from 'react-google-login';
import './LogOut.css'
const clientId =
  '616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com/';

/**==============================================
 **              LoginFunction()
 *?  What does it do? Logs the user in
 *=============================================**/
function LoginFunction() {
  // setup references
  const googleProvider = new GoogleAuthProvider();
  /**======================
   **   signInWithGoogle
   *========================**/
}

/**==============================================
 **              newSignInModel()
 *?  What does it do? new sign in model with Google's oauth2 service
  *@param _userObj object
  *@param _token string
 *=============================================**/
function newSignInModel(_token) {
  // log to console.
  console.log('Sign in model started')
  // set auth token up in browser
  sessionStorage.setItem('authToken', _token)
  // then, we need to pull user id first.
  var xhr = new XMLHttpRequest();
  // we want a object
  xhr.responseType = 'json';
  // get user information
  xhr.open('GET',
    'https://www.googleapis.com/oauth2/v1/userinfo?' +
    'access_token=' + _token);
  // on load
  xhr.onreadystatechange = function (e) {
    // don't do anything yet, lets hold off
    if (xhr.response === null) {

    }
    // now lets start
    console.log('loaded data from Google Services API')
    // db ref
    const dbRef = ref(getDatabase());
    // lets start some of this logic....
    get(child(dbRef, `schools/hvhs/users/${xhr.response.id}`)).then((snapshot) => {
      // if user exists
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setUserObjectLocal(snapshot.val())
        // register
      } else {
        registerUser(xhr.response)
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  };
  // we can now send a response
  xhr.send(null);
}



/**==============================================
 **              registerUser
 *?  What does it do? Registeres the user in the database
 *@param _userObj object
 *=============================================**/
function registerUser(_userObj) {

  // new user object
  let userObject = {
    name: _userObj.name,
    email: _userObj.email,
    hd: _userObj.hd,
    picture: _userObj.picture,
    studentID: _userObj.email.split('@')[0],
    role: 'student',
    uid: _userObj.id,
    classes: {
      notEnrolled: true
    },
    quizzes: {
      active: {
        notEnrolled: true
      },
      turnedin: {
        notEnrolled: true
      }
    }
  }
  const db = getDatabase();
  set(ref(db, 'schools/hvhs/users/' + userObject.uid), userObject);
  setUserObjectLocal(userObject)
}
/**==============================================
 **              LogOut()
 *?  What does it do? Logs the user out
 *=============================================**/
function LogOut() {
  sessionStorage.clear()

  return (
    <div className="logout">
      <Image src="media/branding/appicon-itt6.svg" width='100'></Image>
      <h2><b>You have been signed out</b></h2>
      <Button href="/">Log Back In</Button>
    </div>
  )
};




//* export all modules out
export {
  LoginFunction,
  LogOut,
  newSignInModel

}