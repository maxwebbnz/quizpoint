// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);