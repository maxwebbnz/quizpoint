/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import "firebase/compat/auth";
import "firebase/compat/firestore";


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

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getDatabase(firebaseApp); // For Using Database

export { auth, db };