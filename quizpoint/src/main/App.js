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
// Components for template
import NavBar from './components/NavBar'

// Components
import RedirectLegacy from '../services/RedirectLegacy'

/**==============================================
 **              App()
 *?  What does it do? Main renderer for application
 *=============================================**/
function App() {
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
        </Routes>
      </div>
    );

    // if user is authed
  } else {
    if (user.role === 'teacher') {
      return (
        <div className="App">
          {/* < NavBar /> */}
          <NavBar />
          <Routes>
            <Route path="/" element={<ClassHome />} />
            <Route path="/classes" element={<ClassHome />} />
            <Route path="/classPage/:classId" element={<ClassPage />} />
            <Route path="/quizzes/:quizId" element={<Quiz />} />
            <Route path="/tcs" element={<TeachingHome />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      );
    } else {
      // Start application
      return (
        <div className="App">
          {/* < NavBar /> */}
          <NavBar />
          <Routes>
            <Route path="/" element={<ClassHome />} />
            <Route path="/classes" element={<ClassHome />} />
            <Route path="/classHome" element={<RedirectLegacy />} />
            <Route path="/classPage/:classId" element={<ClassPage />} />
            <Route path="/quizzes/:quizId" element={<Quiz />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      );
    }
  }


  // they need to sign in!

}

export default App