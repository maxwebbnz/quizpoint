/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

//? Import components
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/compat/auth";
import "firebase/compat/firestore";

//* Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByeEa_02Ilck48qdVip1zJc8kpWuBy2bU",
  authDomain: "quizpoint-nz.firebaseapp.com",
  databaseURL: "https://quizpoint-nz-default-rtdb.firebaseio.com",
  projectId: "quizpoint-nz",
  storageBucket: "quizpoint-nz.appspot.com",
  messagingSenderId: "235262689225",
  appId: "1:235262689225:web:148b6dd89f8ebc4ab4b218",
  measurementId: "G-J7VPX0FG0L"
};

//* Initialize firebase
const firebaseApp = initializeApp(firebaseConfig);
// auth service
const auth = getAuth(firebaseApp);
// database service
const db = getDatabase(firebaseApp);

/**==============================================
 **              dbFunctions
 *?  What does it do? Database functions
 *=============================================**/
let dbFunctions = {
  /**==============================================
   **              read
   *?  What does it do? Reads data and returns data
   *@return promise
   *=============================================**/
  read: async (_path) => {
    // decleration
    let dataToReturn;
    // read data
    const pathRef = ref(db, `schools/hvhs/${_path}/`);
    // wait for data
    const snapshot = onValue(pathRef, (snapshot) => {
      const data = snapshot.val();
      dataToReturn = data
    })
    // return data
    await snapshot
    return dataToReturn
  }
}

//? export methods
export { auth, db, dbFunctions, ref };