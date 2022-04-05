/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import * as React from "react";
// removing link cause not used yet...
import { Routes, Route } from "react-router-dom";
import "./App.css";
// Pages
import Home from '../home/Home'
import ClassHome from '../classes/ClassHome'
import ClassPage from '../classes/ClassPage'
import Quiz from '../quizzes/Quiz'
import TeachingHome from '../teachingsuite/Dashboard'

// Components for template
import NavBar from './components/Navbar'

function App() {
  return (
    <div className="App">
      < NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<ClassHome />} />
        <Route path="/classPage" element={<ClassPage />} />
        <Route path="/quizzes" element={<Quiz />} />
        <Route path="/tcs" element={<TeachingHome />} />
      </Routes>
    </div>
  );
}

export default App