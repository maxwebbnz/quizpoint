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
    let chosenAnswers = {}

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


    let quizHandler = {
        // When "Next" is clicked, cycle through to the next question
        nextQuestion: () => {
            if (currentQuestion == (quiz.questions.length - 1)) return
            setCurrentQuestion(currentQuestion + 1);
        },
        //When "Back" is clicked, cycle through to the last question
        lastQuestion: () => {
            if (currentQuestion == 0) return
            setCurrentQuestion (currentQuestion - 1);
        },
        recordAnswer: (answer) => {
            chosenAnswers[currentQuestion] = answer;
            console.log(chosenAnswers)
            quizHandler.nextQuestion()
        }
    }

    //If the website is still "loading..." don't display anything
    if (loadingStatus === true) return 

    //HTML
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
                    {quiz.questions[currentQuestion].choices.map(answer => {
                        return <button onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</button>
                    })}
                </div>
                <div className="quizNavigationOptions">
                    <button onClick={quizHandler.lastQuestion}>Back</button>
                    <button onClick={quizHandler.nextQuestion}>Next</button>
                </div>

            </div>
        </>
    )
}



