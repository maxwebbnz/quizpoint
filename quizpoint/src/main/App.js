/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import * as React from "react";
import { useEffect, useState } from 'react';

// removing link cause not used yet...
import { Routes, Route } from "react-router-dom";

import "./App.css";
// import { useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

// km
import { user, updateUserData } from '../firebase/fb.user.js';

// Pages
import { LogOut } from '../services/Login'
import ClassHome from '../classes/ClassHome'
import LandingPage from "../home/LandingPage";
import ClassPage from '../classes/ClassPage'
import UserPage from '../User/UserPage'
import Quiz from '../quizzes/Quiz'
import TeachingHome from '../teachingsuite/Dashboard'
import NotFoundPage from './404'
import Invite from '../services/invite'

// TeachingSuite
import Students from "../teachingsuite/Students";
import Classes from "../teachingsuite/Classes";
import Quizzes from "../teachingsuite/Quizzes";
import Reporting from "../teachingsuite/Reporting";
// Components for template
import NavBar from './components/NavBar'
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue } from "firebase/database";

// Components
import RedirectLegacy from '../services/RedirectLegacy'
import TeacherStudent from "../User/UserPageTeacher";
import CreateClass from "../teachingsuite/CreateClass";
import CreateQuiz from "../teachingsuite/CreateQuiz";
import EditQuiz from "../teachingsuite/EditQuiz";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useMediaQuery } from 'react-responsive'
import ClassReport from "../teachingsuite/reportingfeatures/ClassReport";
import StudentReport from "../teachingsuite/reportingfeatures/StudentReport";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';


/**==============================================
 **              App()
 *?  What does it do? Main renderer for application
 *=============================================**/
function App() {

  // Same config object passed to `gapi.auth2.init`
  // https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams

  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const [openDialog, setDialog] = useState(false)
  let action

  // user not logged in
  if (user.authed === false) {
    return (
      // render landing page, restrict routes.
      <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
        <div className="App">
          {/* < NavBar /> */}
          {/* <NavBar /> */}
          <Routes>
            <Route path="*" element={<LandingPage />} />
            <Route path="/*" element={<LandingPage />} />
          </Routes>
        </div>
      </GoogleOAuthProvider>

    );

    // if user is authed
  } else {
    const db = getDatabase();
    const userPath = ref(db, 'schools/hvhs/users/' + user.uid);
    onValue(userPath, (snapshot) => {
      console.log('Data changed')
      action = (
        <Button color="secondary" size="small">
          lorem ipsum dolorem
        </Button>
      )
      // updateUserData(snapshot.v al());

    });
    if (user.role === 'teacher') {
      return (
        <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">

          <div className="App">
            <Snackbar open={openDialog} autoHideDuration={6000}>
              <SnackbarContent message="I love snacks." action={action} />

            </Snackbar>
            {/* < NavBar /> */}
            <NavBar />
            <Routes>
              <Route path="/" element={<ClassHome />} />
              <Route path="/classes" element={<ClassHome />} />
              <Route path="/class/:classId" element={<ClassPage />} />
              <Route path="/quiz/:quizId" element={<Quiz />} />
              <Route path="/invite/:id" element={<Invite />} />
              <Route path="/user/:id" element={<UserPage />} />
              {/* Teaching Suite routes */}
              <Route path="/tcs" element={<TeachingHome />} />
              <Route path="/tcs/students/:type" element={<Students />} />
              <Route path="/tcs/user/:id" element={<TeacherStudent />} />
              <Route path="/tcs/classes" element={<Classes />} />
              <Route path="/tcs/classes/create/:id" element={<CreateClass />} />
              <Route path="/tcs/quizzes" element={<Quizzes />} />
              <Route path="/tcs/quizzes/create/:id" element={<CreateQuiz />} />
              <Route path="/tcs/quizzes/edit/:id" element={<EditQuiz />} />
              <Route path="/tcs/reporting" element={<Reporting />} />
              <Route path="/tcs/reporting/:field" element={<Reporting />} />
              <Route path="/tcs/reports/class/:id" element={<ClassReport />} />
              <Route path="/tcs/reports/student/:id" element={<StudentReport />} />
              <Route path="/tcs" element={<TeachingHome />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </GoogleOAuthProvider>
      );
    } else {
      // Start application
      return (
        <GoogleOAuthProvider clientId="616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com">
          <div className="App">
            {/* < NavBar /> */}
            <NavBar />
            <Routes>
              <Route path="/" element={<ClassHome />} />
              <Route path="/classHome" element={<RedirectLegacy />} />
              <Route path="/classes" element={<ClassHome />} />
              <Route path="/class/:classId" element={<ClassPage />} />
              <Route path="/invite/:id" element={<Invite />} />
              <Route path="/quiz/:quizId" element={<Quiz />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </GoogleOAuthProvider>
      );
    }
  }
}




// they need to sign in!


export default App