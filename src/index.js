// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { getDatabase, ref, set, onValue, update } from "firebase/database"
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
let defaultPath = "/schools/hvhs";

let fb = {
//Write data to firebase
//_path = directory in firebase e.g users, NOTE: defaultPath already has /schools/hvhs inputted
//_id = id of document, e.g uid from Google Login, class Id
//_data = data being written in database, ideally an array e.g name, role, email
    write: (_path, _id, _data) => {
        console.log("fb.write: Path: " + _path + "/" + _id + " Data: " + _data);
        const db = getDatabase();
        update(ref(db, defaultPath + '/' + _path + '/' + _id), (_data));
    },
//Read data in firebase
//_path = directory in firebase e.g users, NOTE: defaultPath already has /schools/hvhs inputted
//_id = id of document, e.g uid from Google Login, class Id
    read: (_path, _id) => {
        console.log("fb.read: Reading " + _path);
        const readDataRef = ref(db, defaultPath + "/" + _path + "/" + _id);
        onValue(readDataRef, (dataRecieved) => {
        if (dataRecieved.val() == null) return console.log("fb.read: No record found at " + _path);
        if (dataRecieved){
            let data = dataRecieved.val();
            console.log(data)
            return data;
            }
        })
    },
}