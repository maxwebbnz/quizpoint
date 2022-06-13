/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Import Statements

import { setUserObjectLocal } from "../firebase/fb.user"
import { Image, Button } from 'react-bootstrap'
import logOutBack from './media/logoutback.png'
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { useGoogleLogout } from 'react-google-login';

import './LogOut.css'
/**==============================================
 **              LoginFunction()
 *?  What does it do? Logs the user in
 *=============================================**/
function LoginFunction() {
  // setup references
  const auth = getAuth()
  const googleProvider = new GoogleAuthProvider();
  /**======================
     **   signInWithGoogle
     *========================**/
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        // then read data
        const dbRef = ref(getDatabase());
        // access data
        get(child(dbRef, `schools/hvhs/users/${res.user.uid}`)).then((snapshot) => {
          // if user exists
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUserObjectLocal(snapshot.val())
            // register
          } else {
            registerUser(res.user)
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.log(error)
        return;
      });
  };
  // run above function
  signInWithGoogle()
}


/**==============================================
 **              newSignInModel()
 *?  What does it do? new sign in model with Google's oauth2 service
  *@param _userObj object
  *@param _token string
 *=============================================**/
function newSignInModel(_token) {
  const auth = getAuth();
  signInWithCustomToken(auth, _token)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user)
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
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.log(error)
    });
  // log to console.

}



/**==============================================
 **              registerUser
 *?  What does it do? Registeres the user in the database
 *@param _userObj object
 *=============================================**/
function registerUser(_userObj) {
  if (_userObj.hd === undefined) {
    // new user object
    let userObject = {
      name: _userObj.displayName,
      email: _userObj.email,
      hd: 'none',
      picture: _userObj.photoURL,
      studentID: _userObj.email.split('@')[0],
      role: 'student',
      uid: _userObj.uid,
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
  } else {
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

}
/**==============================================
 **              LogOut()
 *?  What does it do? Logs the user out
 *=============================================**/
function LogOut() {
  // const auth = getAuth();
  // signOut(auth).then(() => {
  //   sessionStorage.clear()
  // }).catch((error) => {
  //   // An error happened.
  // });
  return (
    <div className="logoutPage" style={{ backgroundImage: `url(${logOutBack})` }}>
      <div className="logout">
        <Image src="media/branding/appicon-itt6.svg" width='100'></Image>
        <h2><b>Haere rā</b></h2>
        <h3>See you next time.</h3>
        <button className="generic-button" href="/">Log Back In</button>
      </div>
    </div>
  )
};




//* export all modules out
export {
  LogOut,
  LoginFunction,
  newSignInModel

}