/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


// Base imports from react
import axios from 'axios'

import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { storage } from "../services/firebase.js"

// user model
import { user } from '../firebase/fb.user.js';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// styling
import './Quiz.css'
// firebase and db stuff
import { db } from '../services/firebase'
import { ref, onValue, set, update } from "firebase/database";
import { ref as sRef, uploadBytes } from "firebase/storage";
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
            console.log("quizHandler.nextQuestion(): Called");
            if (currentQuestion === (quiz.questions.length - 1)) {
                update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
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
            setCurrentQuestion(currentQuestion + 1);
        },
        //When "Back" is clicked, cycle through to the last question
        lastQuestion: () => {
            console.log("quizHandler.lastQuestion(): Called");
            if (currentQuestion === 0) return
            setCurrentQuestion(currentQuestion - 1);
        },
        recordAnswer: (answer, isImage) => {
            console.log("quizHandler.recordAnswer(): Called");
            console.log(chosenAnswers)
            if (isImage === true) {
                console.log("Answer is an image")
                chosenAnswers.answers[currentQuestion] = {
                    answer: quiz.questions[currentQuestion].answer,
                    question: quiz.questions[currentQuestion].name,
                    status: "correct"
                }
            }else if (isImage === false){
                console.log("Running isImage === false")
                console.log(quiz.questions[currentQuestion].answer.isArray())
                if (quiz.questions[currentQuestion].answer.isArray() === true) {
                    console.log("Answer is in an array");
                    for (let i = 0; i < quiz.questions[currentQuestion].answer.length; i++) {
                        if (quiz.questions[currentQuestion].answer[i] == answer) {
                            chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };
                        }else if (quiz.questions[currentQuestion].answer[i] != answer) {
                            chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
                        }
                    }
                }else if (quiz.questions[currentQuestion].answer.isArray() === false){
                    console.log("Answer is not in an array");
                    if(quiz.questions[currentQuestion].answer == answer) {
                        chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };
                    }else if (quiz.questions[currentQuestion].answer != answer) {
                        chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
                    }
                } 
            }
            chosenAnswers.details = { code: quizId, name: quiz.title, progress: Object.keys(chosenAnswers.answers).length }
            console.log("Uploading Results...")
            update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
            quizHandler.nextQuestion()
        },

        generateImage: () => {
            console.log("quizHandler.generateImage(): Called");
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
                    <p className="quizQuestionCounter">{currentQuestion + 1} / {quiz.questions.length}</p>
                </div>
                <div className="quizQuestionImage">{quizHandler.generateImage()}</div>
                <div className="quizButtons">
                    {quiz.questions[currentQuestion].inputtype === "multichoice" &&
                        <div className="quizQuestionAnswers">
                                <div className="largeButtonGroup">
                                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                    {quiz.questions[currentQuestion].choices.map(answer => {
                                                return <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
                                    })} 
                                    </ButtonGroup>
                                </div>
                                {/* If there are more than four buttons on a small screen */}
                                <div className="smallButtonGroupLarge">
                                    {quiz.questions[currentQuestion].choices.length > 4 && 
                                        quiz.questions[currentQuestion].choices.map(answer => {
                                            return <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
                                        })
                                    }
                                </div>
                                {/* If <= 4 buttons on a small screen */}
                                <div className="smallButtonGroup">
                                    {quiz.questions[currentQuestion].choices.length <= 4 &&
                                        quiz.questions[currentQuestion].choices.map(answer => {
                                            return  <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button> 
                                        })
                                    }       
                                </div>    
                        </div>
                    }
                    {quiz.questions[currentQuestion].inputtype === "imageupload" && 
                        <div className="quizImageUpload">
                            <input type="file" id="file" name="file" accept="image/*" onChange={(e) => {
                                let file = e.target.files[0];
                                let storagePath = 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId + '/' + currentQuestion + '/QUIZPOINT_QUIZ_' + quizId + '_' + currentQuestion;
                                let storageRef = sRef(storage, storagePath);
                                uploadBytes(storageRef, file).then((snapshot) => {
                                    console.log("Uploaded Image to " + storagePath);
                                })
                                quizHandler.recordAnswer(storagePath, true);
                            }}/>
                        </div>
                    }
                    <div className="quizNavigationButtons">
                        <Button variant="outlined" style={{textTransform: "none"}} onClick={quizHandler.lastQuestion}>Back</Button>
                        <Button variant="contained" color="success" style={{textTransform: "none"}} onClick={quizHandler.nextQuestion}>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}



