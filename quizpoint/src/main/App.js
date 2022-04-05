/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import * as React from "react";
// removing link cause not used yet...
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { useLocation } from 'react-router-dom'

// IO
import user from '../User/UserModel'

// Pages
import Login from '../home/Login'
import ClassHome from '../classes/ClassHome'
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
  const location = useLocation();
  // user should not be able to use site without being logged in
  if (user.authed) {
    console.log(location.pathname);
    // home page doesn't need the navigation bar
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
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </div>
      );
    // they need to sign in!
  } else {
    return (
      <div className="App">
        < NavBar />
        <Routes>
          {/* Changed so that if the user is not logged it, it always redirects them to a login screen */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <h2>Sign in please!</h2>
      </div>
    );
  }

}

export default App