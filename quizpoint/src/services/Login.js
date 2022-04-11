/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Import Statements
import { auth } from "./firebase";
import { setUserObjectLocal } from "../firebase/fb.user"
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, child, get, set } from "firebase/database";


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
  setUserObjectLocal(_userObj)
}

/**==============================================
 **              LogOut()
 *?  What does it do? Logs the user out
 *=============================================**/
function LogOut() {
  const auth = getAuth();
  signOut(auth).then(() => {
    sessionStorage.clear()
    window.location.replace('/');
  }).catch((error) => {
    // An error happened.
  });
}


//* export all modules out
export {
  LoginFunction,
  LogOut
}