/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from "firebase/database";
import config from '../Config/ConfigFile'


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

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

/**==============================================
 **              readData
 *?  What does it do? Reads the data
 *@param name type
 *@param name type
 *@return type
 *=============================================**/
const dbRef = ref(getDatabase());

async function readData(_pathToRead) {
    get(child(dbRef, +config.path+_pathToRead)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val()
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export {readData}