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
import {user, setUserObjectLocal} from '../firebase/fb.user.js';

// Pages
import {LoginFunction, LogOut} from '../services/Login'
import ClassHome from '../classes/ClassHome'
import LandingPage from "../home/LandingPage";
import ClassPage from '../classes/ClassPage'
import Quiz from '../quizzes/Quiz'
import TeachingHome from '../teachingsuite/Dashboard'
import NotFoundPage from './404'
// Components for template
import NavBar from './components/NavBar'

/**==============================================
 **              App()
 *?  What does it do? Main renderer for application
 *=============================================**/
function App() {
  useEffect(() => {

  });
  if(user.authed === false){
          return (

        <div className="App">
          {/* < NavBar /> */}
          {/* <NavBar /> */}
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      );
  }else{
      return (

        <div className="App">
          {/* < NavBar /> */}
          <NavBar />
          <Routes>
            <Route path="/" element={<ClassHome />} />
            <Route path="/classes" element={<ClassHome />} />
            <Route path="/classPage/:classId" element={<ClassPage />} />
            <Route path="/quizzes/:quizId" element={<Quiz />} />
            <Route path="/tcs" element={ <TeachingHome /> }/>
            <Route path="/logout" element={ <LogOut /> }/>
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
          <h2>User {user.authed}</h2>
        </div>
      );
  }


    // they need to sign in!

}

export default App