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
import { ref, onValue, set, update,  get, child, remove} from "firebase/database";
import { ref as sRef, uploadBytes } from "firebase/storage";
import Swal from 'sweetalert2';


/**========================================================================
 *                             Quiz Module
 *========================================================================**/
export default function Quiz() {
    const [quiz, setQuiz] = useState()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [chosenAnswers, setChosenAnswers] = useState({ answers: {}, details: {}, score: {}})
    const [correctAnswers, setCorrectAnswers] = useState()
    let { quizId } = useParams()
    let studentId = user.uid
    let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
    let quizInStudentPath = ref(db, `schools/hvhs/users/${user.uid}/quizzes/active/${quizId}`);
    let quizAnswersInStudentPath = ref(db, `schools/hvhs/users/${user.uid}/quizzes/active/${quizId}/answers`)
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
            // If last question
            if (currentQuestion === (quiz.questions.length - 1)) {
                update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
                Swal.fire({
                    title: 'Do you want to finish quiz?',
                    showDenyButton: true,
                    denyButtonText: "Back",
                    confirmButtonText: "Finish",
                }) .then ((result) => {
                    if (result.isConfirmed) {
                        console.log("quizHandler.nextQuestion(), User Finished Quiz")
                        get(quizInStudentPath).then ((snapshot) => {
                            if (snapshot.exists()) {
                                let quizSave = {};
                                quizSave[quizId] = snapshot.val();
                                console.log(quizSave)
                                let correctAnswers = 0;
                                let wrongAnswers = 0;
                                for (const key in quizSave[quizId].answers) {
                                    if(`${quizSave[quizId].answers[key].status}` === "correct"){
                                        correctAnswers++
                                        quizSave[quizId].score = {correct: correctAnswers}
                                    }
                                    if(`${quizSave[quizId].answers[key].status}` === "incorrect"){
                                        wrongAnswers++
                                        quizSave[quizId].score = {correct: wrongAnswers}
                                    }

                                }
                                update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/turnedin'), quizSave).then(() => {
                                    remove(quizInStudentPath);
                                });
                            } else {
                                console.log("Snapshot does not exist")
                            }
                        })
                        
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
            if (isImage === true) {
                chosenAnswers.answers[currentQuestion] = {
                    input: answer,
                    question: quiz.questions[currentQuestion].name,
                    status: "correct"
            }
            }else if (isImage === false){
                // Check if multiple answers to quiz
                if (Array.isArray(quiz.questions[currentQuestion].answer) === true) {
                    // Checks if answer matches any of the multi choice
                    for (let i = 0; i < quiz.questions[currentQuestion].answer.length; i++) {
                        console.log("Answers: " + quiz.questions[currentQuestion].answer[i].value);
                        if (quiz.questions[currentQuestion].answer[i].value == answer) {
                            chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };  
                        }else if (quiz.questions[currentQuestion].answer[i].value != answer) {
                            chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
                        }
                    }
                // If only one answer to quiz
                }else if (Array.isArray(quiz.questions[currentQuestion].answer) === false){
                    console.log("Answer is not in an array");
                    // Correct Answer
                    if(quiz.questions[currentQuestion].answer == answer) {
                        chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };
                    // Wrong Answer
                    }else if (quiz.questions[currentQuestion].answer != answer) {
                        chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
                    }
                } 
            }
            chosenAnswers.details = { code: quizId, name: quiz.title }

            console.log("Uploading Results...")
            update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
            quizHandler.nextQuestion()
        },

        generateImage: () => {
            console.log("quizHandler.generateImage(): Called");

            if (quiz.questions[currentQuestion].image){
                return <img  alt="Quiz Question Image" src={quiz.questions[currentQuestion].image}></img>
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
                <div className="quizContent">
                <div className="quizQuestionImage">{quizHandler.generateImage()}</div>
                    <div className="quizButtons">
                        {quiz.questions[currentQuestion].inputtype != "imageupload" &&
                            <div className="quizQuestionAnswers">
                                {/* If there are four or less buttons */}
                                {quiz.questions[currentQuestion].choices.length <= 4  &&
                                    <div className="largeButtonGroup">
                                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                            {quiz.questions[currentQuestion].choices.map(answer => {
                                                return <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
                                            })}
                                        </ButtonGroup>
                                    </div>
                                }
                                {/* If there are more than four buttons (Needed to fit neatly onto page) */}
                                {quiz.questions[currentQuestion].choices.length > 4 && 
                                    <div className="largeButtonGroup hasMoreThanFourButtons">
                                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                            {quiz.questions[currentQuestion].choices.map(answer => {
                                                return <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
                                            })}
                                        </ButtonGroup>
                                    </div> 
                                }
                                {/* If there are more than four buttons on a small screen */}
                                <div className="smallButtonGroupLarge">
                                    {quiz.questions[currentQuestion].choices.length > 4 && 
                                        quiz.questions[currentQuestion].choices.map(answer => {
                                            return <Button variant="contained" className="quizAnswerButtons" style={{textTransform: "none"}} onClick = {() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
                                        })
                                    }
                                </div>
                                {/* If there are less than or equal to 4 buttons on a small screen */}
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
        </div>
    )
}



