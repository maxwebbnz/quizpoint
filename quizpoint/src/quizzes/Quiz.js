/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


// Base imports from react
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { dbFunctions, auth, storage, dbFunctionsSync } from "../services/firebase.js"
// user model
import { user } from '../firebase/fb.user.js';
// alerts
import { alert } from '../services/Alert'
// styling
import './Quiz.css'
// firebase and db stuff
import { db } from '../services/firebase'
import { ref, onValue } from "firebase/database";
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useMediaQuery } from 'react-responsive'


/**========================================================================
 *                             Quiz Module
 *========================================================================**/
export default function Quiz() {
    const [quiz, setQuiz] = useState()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)

    let { quizId } = useParams()
    let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);

    // useEffect operates when the page loads. This finds the quiz in firebase and sets it to the state 'quiz'
    useEffect(() => {
        onValue(quizPath, (snapshot) => {
            setQuiz(snapshot.val());
            console.log("Quiz Id: " + quizId)
            console.log("Quiz Path: " + quizPath)
            console.log(snapshot.val())
            setLoadingStatus(false)
        })
    }, [])

    function nextQuestion (){
        if (currentQuestion == (quiz.questions.length - 1)) return
        setCurrentQuestion(currentQuestion + 1);
    }
    function previousQuestion () {
        if (currentQuestion == 0) return
        setCurrentQuestion (currentQuestion - 1);
    }

    if (loadingStatus === true) { return }
    return (
        <>
            <div className="quizTitle">
                <p>{quiz.title}</p>
            </div>
            <div className="quizContainer">
                <div className="quizQuestionTitle">
                    <p>{quiz.description}</p>
                </div>
                <div className="quizQuestionAnswers">
                    {quiz.questions[currentQuestion].choices.map(answers => {
                        return <button key={answers}>{answers}</button>
                    })}
                </div>
                <div className="quizNavigationOptions">
                    <button onClick={previousQuestion}>Back</button>
                    <button onClick={nextQuestion}>Next</button>
                </div>

            </div>
        </>
    )
}



