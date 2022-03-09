// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database"
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
const scanForSignIn = getAuth();
const db = getDatabase();
const auth = getAuth();

//Write data to Google Firebase
function writeData(_path, _subPath, _uid, _function) {
    console.log("Writing To: " + _path + "/" + _uid);
    const db = getDatabase();
    set(ref(db, _path + "/" + _uid + "/" + _subPath), (_function));
    }

function readAllData(_path, _subPath, _processData){
    const readDataRef = ref(db, _path + "/" + _uid + "/" + _subPath);
    onValue(readDataRef, (dataRecieved) => {
    if (dataRecieved.val() == null) return console.log("No Record Found")
    if (dataRecieved) return _processData(dataRecieved)})
    }

function readData(_path, _subPath, _uid, _processData){
    const readDataRef = ref(db, _path + "/" + _uid + "/" + _subPath);
    onValue(readDataRef, (dataRecieved) => {
    if (dataRecieved.val() == null) return console.log("No Record Found")
    if (dataRecieved) return _processData(dataRecieved)
    })
    }