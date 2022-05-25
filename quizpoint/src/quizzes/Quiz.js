/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


// Base imports from react
import axios from 'axios'

import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { dbFunctions, auth, storage, dbFunctionsSync } from "../services/firebase.js"
import { Navigate, Route } from "react-router-dom";
// user model
import { user } from '../firebase/fb.user.js';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

// styling
import './Quiz.css'
// firebase and db stuff
import { db } from '../services/firebase'
import { ref, onValue, set } from "firebase/database";
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive'


/**========================================================================
 *                             Quiz Module
 *========================================================================**/
export default function Quiz() {
    const [quiz, setQuiz] = useState()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [chosenAnswers, setChosenAnswers] = useState({ answers: {}, details: {} })
    let { quizId } = useParams()
    let studentId = user.uid
    let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
    let studentPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
    // `schools/users/${studentId}/quizzes/turnedin/${quizId}`
    // Stepper Variables

    // useEffect operates when the page loads. This finds the quiz in firebase and sets it to the state 'quiz'
    useEffect(() => {
        onValue(quizPath, (snapshot) => {
            setQuiz(snapshot.val());
            setLoadingStatus(false);
            console.log("Quiz Id: " + quizId)
            console.log("Quiz Path: " + quizPath)
            console.log(snapshot.val())
            setLoadingStatus(false)

        })
    }, [])

    let quizHandler = {
        // When "Next" is clicked, cycle through to the next question
        nextQuestion: () => {
            if (currentQuestion === (quiz.questions.length - 1)) {
                set(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
                Swal.fire({
                    title: 'Completed',
                })
                return
            }
            setCurrentQuestion(currentQuestion + 1);
        },
        //When "Back" is clicked, cycle through to the last question
        lastQuestion: () => {
            if (currentQuestion === 0) return
            setCurrentQuestion(currentQuestion - 1);
        },
        recordAnswer: (answer) => {
            console.log(chosenAnswers)
            if (answer == quiz.questions[currentQuestion].answer) {
                chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };
            } else if (answer != quiz.questions[currentQuestion].answer) {
                chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
            }
            chosenAnswers.details = { code: quizId, name: quiz.title, progress: Object.keys(chosenAnswers.answers).length }
            quizHandler.nextQuestion()
        },
        generateImage: () => {
            if (quiz.questions[currentQuestion].image){
                return <img  alt="Quiz Question Image" src={quiz.questions[currentQuestion].image}></img>
            }else{
                return
            }
        }
    }

    //If the website is still "loading..." don't display anything
    if (loadingStatus === true) return
    function CheckImage(path) {
        axios
            .get(path)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }
    //HTML
    return (
        <div className="quizPage">
            <div className="quizTitle">
                <p>{quiz.title}</p>
            </div>
            <div className="quizContainer">
                <div className="quizQuestionTitle">
                    <p>{quiz.questions[currentQuestion].name}</p>
                    <p>{currentQuestion + 1} / {quiz.questions.length}</p>
                </div>
                <div className="quizQuestionImage">{quizHandler.generateImage()}</div>
                <div className="quizButtons">
                    <div className="quizQuestionAnswers">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            {quiz.questions[currentQuestion].choices.map(answer => {
                                return <Button className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</Button>
                            })}
                        </ButtonGroup>
                    </div>
                    <div className="quizNavigationButtons">
                        <Button variant="outlined" style={{textTransform: "none"}} onClick={quizHandler.lastQuestion}>Back</Button>
                        <Button variant="contained" color="success" style={{textTransform: "none"}} onClick={quizHandler.nextQuestion}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



