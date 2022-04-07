/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { auth } from "../services/firebase";
import { user, setUserObjectLocal } from "../firebase/fb.user"
// import User from "../firebase/fb.user"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import React,  from 'react';

import { getDatabase, ref, child, get } from "firebase/database";


export default function LoginPage() {
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log(res.user.email)
        console.log(user)
        // then read data
        const dbRef = ref(getDatabase());
        get(child(dbRef, `schools/hvhs/users/${res.user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUserObjectLocal(snapshot.val())
          } else {
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
  return (
    <button onClick={signInWithGoogle}>Login with Google</button>
  )

}