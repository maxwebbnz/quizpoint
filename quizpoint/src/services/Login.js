/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Import Statements
import { auth } from "./firebase";
import { setUserObjectLocal } from "../firebase/fb.user"
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { dbFunctions } from "./firebase";
import { Image, Button } from 'react-bootstrap'
import './LogOut.css'

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
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        // then read data

        // wait callback
        dbFunctions.read(`/users/${res.user.uid}`).then((snapshot) => {
          if (snapshot === undefined) {
            registerUser(res.user)
            console.log("No data available");
          } else {
            console.log(snapshot);
            setUserObjectLocal(snapshot)
          }
        })

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
 **              registerUser
 *?  What does it do? Registeres the user in the database
 *@param _userObj object
 *=============================================**/
function registerUser(_userObj) {
  let userObject = {
    name: _userObj.displayName,
    email: _userObj.email,
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

  set(ref(db, 'schools/hvhs/users/' + _userObj.uid), userObject);

  setUserObjectLocal(userObject)
}

/**==============================================
 **              LogOut()
 *?  What does it do? Logs the user out
 *=============================================**/
function LogOut() {
  const auth = getAuth();
  signOut(auth).then(() => {
    sessionStorage.clear()
  }).catch((error) => {
    // An error happened.
  });
  return (
    <div className="logout">
      <Image src="media/branding/appicon-itt6.svg" width='100'></Image>
      <h2><b>You have been signed out</b></h2>
      <Button href="/">Return Home</Button>
    </div>
  )
}


//* export all modules out
export {
  LoginFunction,
  LogOut
}