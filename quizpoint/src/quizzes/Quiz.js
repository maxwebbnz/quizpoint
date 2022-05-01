/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

//! Still working on this file, a holiday job! Feel free to edit, tinker, etc Allan!

import { user } from '../firebase/fb.user.js';
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
// alerts
import { alert } from '../services/Alert'

import { db } from '../services/firebase'
import { ref, onValue, update, get } from "firebase/database";
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

let currentQuiz = []
let currentQuizTitle
let choiceArray = []
export default function Quiz() {

    // set states for use across in useeffect
    const [loadingQuiz, setLoadingStatus] = useState(false)
    const [currentQuestionObject, setCq] = useState({})
    const [error, errorOccured] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [shouldFade, setFade] = useState(true)

    // get params
    let { quizId } = useParams()
    // console.log(quizId)
    //use effect to listen to changes
    useEffect(() => {
        // loaded complete
        if (loadingQuiz === true) {
            document.title = ' Quiz | QuizPoint'

            // if not, need to load data
        } else {
            // set dom title
            document.title = ' Loading Quiz | QuizPoint'
            //read database
            let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
            // load data
            onValue(quizPath, (snapshot) => {
                // if no data
                if (snapshot.val() === null) {
                    console.log('Quiz not there')
                    alert.error('Quiz not found', 'The quiz you are looking for does not exist')
                    setFade(false)
                    // data exists
                } else {
                    const data = snapshot.val()
                    console.log("Quiz Exists: ")
                    console.log(data)
                    let questionsArray = snapshot.val().questions

                    currentQuizTitle = snapshot.val().title
                    for (var index = 0; index < questionsArray.length; index++) {
                        currentQuiz.push(questionsArray[index])
                    }
                    let userProgress = user.quizzes.active[quizId].progress
                    console.log(userProgress)
                    if (userProgress === null || userProgress === 0) {
                        // lol this was dumb of me, obvi the first is equal to 1
                        setCurrentQuestion(1)
                        console.log(currentQuestion)
                    } else {
                        //? don't know why i copied this in the old version, we will see what happens
                        setCurrentQuestion(currentQuestion)
                        console.log(currentQuestion)
                    }
                    console.log(currentQuestion)
                    console.log(currentQuiz)
                    setCq({
                        question: currentQuiz[currentQuestion],
                    })
                    console.log(currentQuestionObject)
                    for (var i = 0; i < currentQuiz[currentQuestion].choices.length; i++) {
                        if (currentQuiz[currentQuestion].choices[i] === undefined) {
                            console.log('undefined')
                        } else {
                            choiceArray.push(currentQuiz[currentQuestion].choices[i])
                        }
                    }
                    console.log(choiceArray)
                    setLoadingStatus(true)
                }
            })

        }


    })

    function nextQuestion(option) {

        //? update progress happens here..
        console.log("User answered with " + option)
        // set up object
        setCq({
            question: currentQuiz[currentQuestion + 1],
        })
        setCurrentQuestion(currentQuestion + 1)

    }

    if (loadingQuiz === false) {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>)
    } else {

        return (
            <div>
                <h1>Quiz Title: {currentQuizTitle}</h1>

                <h3>Question #{currentQuestion}</h3>
                <hr></hr>
                <h3>{currentQuestionObject.question.title}</h3>
                <div className='answer-section'>
                    {currentQuestionObject.question.choices.map((answerOption, index) => (
                        <button onClick={() => nextQuestion(answerOption)}>{answerOption}</button>
                    ))}
                </div>
            </div>
        )
    }

}