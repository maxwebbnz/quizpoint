/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import * as React from "react";
import { useEffect } from 'react';

// removing link cause not used yet...
import { Routes, Route } from "react-router-dom";

import "./App.css";
// import { useLocation } from 'react-router-dom'

// km
import { user } from '../firebase/fb.user.js';

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


// Components
import RedirectLegacy from '../services/RedirectLegacy'
import TeacherStudent from "../User/UserPageTeacher";
import CreateClass from "../teachingsuite/CreateClass";
import CreateQuiz from "../teachingsuite/CreateQuiz";
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useMediaQuery } from 'react-responsive'
import { GApiProvider } from 'react-gapi-auth2';
import ClassReport from "../teachingsuite/reportingfeatures/ClassReport";

const clientConfig = {
  client_id: '616231612574-unh76pn0grtjqdj5ggqg2fq7b6rti4gi.apps.googleusercontent.com',
  cookie_policy: 'single_host_origin',
  scope: 'https://www.googleapis.com/auth/<POLICY>'
  // etc...
};
/**==============================================
 **              App()
 *?  What does it do? Main renderer for application
 *=============================================**/
function App() {

  // Same config object passed to `gapi.auth2.init`
  // https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  // trialing, don't mind this
  useEffect(() => {

  });
  // user not logged in
  if (user.authed === false) {
    return (
      // render landing page, restrict routes.
      <div className="App">
        {/* < NavBar /> */}
        {/* <NavBar /> */}
        <Routes>
          <Route path="*" element={<LandingPage />} />
          <Route path="/*" element={<LandingPage />} />
        </Routes>
      </div>
    );

    // if user is authed
  } else {
    if (!isTabletOrMobile) {
      if (user.role === 'teacher') {
        return (
          <GApiProvider clientConfig={clientConfig}>
            <div className="App">
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
                <Route path="/tcs/reporting" element={<Reporting />} />
                <Route path="/tcs/reporting/:field" element={<Reporting />} />
                <Route path="/tcs/reports/class/:id" element={<ClassReport />} />
                <Route path="/tcs" element={<TeachingHome />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </GApiProvider>
        );
      } else {
        // Start application
        return (
          <GApiProvider clientConfig={clientConfig}>

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
          </GApiProvider>
        );
      }

    } else {
      if (user.role === 'teacher') {
        return (
          <GApiProvider clientConfig={clientConfig}>
            <div className="App">
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
                <Route path="/tcs/reporting" element={<Reporting />} />
                <Route path="/tcs" element={<TeachingHome />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: 16, right: 16 }}>
                <Fab variant="extended" color="primary" aria-label="add">
                  <NavigationIcon /> Go Back
                </Fab>
              </Box>
            </div>
          </GApiProvider>
        );
      } else {
        // Start application
        return (
          <GApiProvider clientConfig={clientConfig}>
            <div className="App">
              {/* < NavBar /> */}
              <NavBar />
              <Routes>
                <Route path="/" element={<ClassHome />} />
                <Route path="/classHome" element={<RedirectLegacy />} />
                <Route path="/classes" element={<ClassHome />} />
                <Route path="/class/:classId" element={<ClassPage />} />            <Route path="/invite/:id" element={<Invite />} />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: 16, right: 16 }}>
                <Fab color="primary" aria-label="add">
                  <h3><i className="bi bi-plus"></i></h3>
                </Fab>
              </Box>
            </div>
          </GApiProvider>
        );
      }
    }
  }


  // they need to sign in!

}

export default App