/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

//! top level variables for firebase should go here
// let user;

function fb_init() {
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
    firebase.initializeApp(firebaseConfig);
    debug.handler("fb_init | Connected to " + firebaseConfig.projectId + "'s Firebase Project", "info")
}