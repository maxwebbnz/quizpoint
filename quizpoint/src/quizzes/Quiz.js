/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


// Base imports from react
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { dbFunctions, auth, storage, dbFunctionsSync } from "../services/firebase.js"
import { Navigate, Route } from "react-router-dom";
// user model
import { user } from '../firebase/fb.user.js';
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
    const [chosenAnswers, setChosenAnswers] = useState({answers: {}, details: {}})
    let { quizId } = useParams()
    let studentId = user.uid
    let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
    let studentPath = ref(db,`/schools/hvhs/quizzes/${quizId}`);
    // `schools/users/${studentId}/quizzes/turnedin/${quizId}`
    // Stepper Variables
    const [steps, setSteps] = useState([])
    const [activeStep, setActiveStep] = useState(0)
    const [completed, setCompleted] = useState({})
    let stepsHandler = {
        totalSteps: () => {
            return steps.length
        },
        completedSteps: () => {
            return completed.length
        }
    }

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
            setCurrentQuestion (currentQuestion - 1);
        },
        recordAnswer: (answer) => {
            console.log(chosenAnswers)
            if (answer == quiz.questions[currentQuestion].answer){
                chosenAnswers.answers[currentQuestion] = {input: answer, question: quiz.questions[currentQuestion].name, status:"correct"};
            } else if (answer != quiz.questions[currentQuestion].answer){
                chosenAnswers.answers[currentQuestion] = {input: answer, question: quiz.questions[currentQuestion].name, status:"incorrect"};
            }
            chosenAnswers.details = {code: quizId, name: quiz.title, progress: Object.keys(chosenAnswers.answers).length}
            quizHandler.nextQuestion()
            stepsHandler.completedSteps()
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
                    <p>{quiz.questions[currentQuestion].name}</p>
                </div>
                <div className="quizQuestionImage"><img  alt=":)" src={quiz.questions[currentQuestion].image}></img></div>
                <div className="quizButtons">
                    <div className="quizQuestionAnswers">
                    {quiz.questions[currentQuestion].choices.map(answer => {
                        return <button className="quizAnswerButtons" onClick = {() => quizHandler.recordAnswer(answer)} key={answer}>{answer}</button>
                    })}
                    </div>
                    <div className="quizNavigationButtons">
                        <button onClick={quizHandler.lastQuestion}>Back</button>
                        <button onClick={quizHandler.nextQuestion}>Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}



