/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**======================
 **   Data service Imports
 *========================**/import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, get, set } from "firebase/database";
import { getStorage } from "firebase/storage";
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
const storage = getStorage(firebaseApp);

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
  read: async (_path, _full) => {
    if (_full) {
      // decleration
      let dataToReturn;
      // read data
      const pathRef = ref(db, `/schools/hvhs/${_path}/`);
      // wait for data
      const snapshot = get(pathRef, (snapshot) => {
        const data = snapshot;
        dataToReturn = data
      })
      // return data
      await snapshot
      return dataToReturn
    } else {
      // decleration
      let dataToReturn;
      // read data
      const pathRef = ref(db, `schools/hvhs/${_path}/`);
      // wait for data
      const snapshot = get(pathRef, (snapshot) => {
        const data = snapshot.val();
        dataToReturn = data
      })
      // return data
      await snapshot
      return dataToReturn
    }

  },
  /**==============================================
   **              Write
   *?  What does it do? Writes data to database.
   *@param name type
   *@param name type
   *@return type
   *=============================================**/
  write: async (_path, _data) => {
    let pathToWrite = _path
    let object = _data;

    // write data
    const pathRef = ref(db, `schools/hvhs/${pathToWrite}/`);
    // return for .then() statements.
    return update(pathRef, object);

  }
}

let dbFunctionsSync = {
  read: (_path) => {
    let pathToWrite = _path;
    let pathRef = ref(db, `schools/hvhs/${pathToWrite}/`);
    //write data
    onValue(pathRef, (dataRecieved) => {
      console.log("dbFunctionsSync.read Path: " + pathRef)
      if (dataRecieved.val() == null) return console.log("dbFunctionsSync.read: No Record Found")
      return dataRecieved;
    })
  },
  write: (_path, _data) => {
    set(ref(db, _path), (_data))
    console.log("dbFunctionsSync.write: Writing To => " + _path)
  }
}
//? export methods
export { auth, db, dbFunctions, ref, storage, dbFunctionsSync };