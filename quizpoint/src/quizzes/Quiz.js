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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'

// styling
import './Quiz.css'
// firebase and db stuff
import { db } from '../services/firebase'
import { ref, onValue, set } from "firebase/database";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Swal from 'sweetalert2';


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
                    title: 'Do you want to finish quiz?',
                    showDenyButton: true,
                    denyButtonText: "Back",
                    confirmButtonText: "Finish",
                }) .then ((result) => {
                    if (result.isConfirmed) {
                        console.log("Quiz Completed")
                    }else if (result.isDenied) {
                        console.log("Quiz Not Completed")
                    }
                })
                return

            }
            var dogAge = '5' + 5;
            console.log(dogAge)
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
                    <p class="quizQuestionCounter">{currentQuestion + 1} / {quiz.questions.length}</p>
                </div>
                <div className="quizQuestionImage">{quizHandler.generateImage()}</div>
                <div className="quizButtons">
                    <div className="quizQuestionAnswers">
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            {quiz.questions[currentQuestion].choices.map(answer => {
                                        return <div className="largeButtonGroup"><Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</Button> </div>
                            })} 
                            </ButtonGroup>
                            {/* If there are more than four buttons on a small screen */}
                            <div className="smallButtonGroupLarge">
                                {quiz.questions[currentQuestion].choices.length > 4 && 
                                    quiz.questions[currentQuestion].choices.map(answer => {
                                        return <Button variant="contained" className="quizAnswerButtons quizAnswerButtonsMoreThanFour" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</Button>
                                    })
                                }
                            </div>
                            {/* If <= 4 buttons on a small screen */}
                            <div className="smallButtonGroup">
                                {quiz.questions[currentQuestion].choices.length <= 4 &&
                                    quiz.questions[currentQuestion].choices.map(answer => {
                                        return  <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</Button> 
                                    })
                                }       
                            </div>    
                        
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



