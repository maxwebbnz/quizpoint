/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


// Base imports from react
import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"

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

// setup variables for file
let currentQuiz = []
let choiceArray = []

/**========================================================================
 *                             Quiz Module
 *========================================================================**/
export default function Quiz() {
    const [quiz, setQuiz] = useState({})
    const [currentQuestion, setCurrentQuestion] = useState (0)

    let {quizId} = useParams()
    console.log("Quiz Id: " + quizId)

    let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
    console.log("Quiz Path: " + quizPath)

}


// export default function Quiz() {
//     const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
//     const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
//     // set states for use across in useeffect 
//     const [loadingQuiz, setLoadingStatus] = useState(false)
//     const [currentQuestionObject, setCq] = useState({})
//     const [currentQuestion, setCurrentQuestion] = useState(0)
//     const [shouldFade, setFade] = useState(true)
//     const [currentQuizTitle, setQuizTitle] = useState('')
//     // get params
//     let { quizId } = useParams()
//     // console.log(quizId)
//     //use effect to listen to changes
//     useEffect(() => {
//         // loaded complete
//         if (loadingQuiz === true) {
//             document.title = currentQuizTitle + ' | QuizPoint'
//             console.log("Loading Quiz: " + currentQuizTitle)
//             // if not, need to load data
//         } else {
//             // set dom title
//             document.title = ' Loading Quiz | QuizPoint'
//             //read database
//             let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
//             // load data
//             onValue(quizPath, (snapshot) => {
//                 // if no data
//                 if (snapshot.val() === null) {
//                     // alert an error
//                     console.log('Quiz not there')
//                     alert.error('Quiz not found', 'The quiz you are looking for does not exist')
//                     setFade(false)
//                     // data exists
//                 } else {
//                     // reference to data
//                     // quiz exists at
//                     console.log("Quiz Exists: ")
//                     // setup questions array
//                     let questionsArray = snapshot.val().questions
//                     // set quiz title
//                     setQuizTitle(snapshot.val().title)
//                     // for each question, push it to the currentquiz
//                     for (var index = 0; index < questionsArray.length; index++) {
//                         currentQuiz.push(questionsArray[index])
//                     }
//                     // get user progress
//                     let userProgress = user.quizzes.active[quizId].progress
//                     // if user progress is null, or if the user hasn't started
//                     if (userProgress === null || userProgress === 0) {
//                         // lol this was dumb of me, the first is equal to 1
//                         setCurrentQuestion(1)

//                         // if user has started
//                     } else {
                        // ? don't know why i copied this in the old version, we will see what happens
//                         setCurrentQuestion(currentQuestion)
//                     }
//                     // set current question
//                     setCq({
//                         question: currentQuiz[currentQuestion],
//                     })

//                     console.log('Quiz Setup', currentQuestionObject)
//                     // for all questions, push them to the choice array
//                     for (var i = 0; i < currentQuiz[currentQuestion].choices.length; i++) {
//                         // if choice is undefined (stupid array stuff)
//                         if (currentQuiz[currentQuestion].choices[i] === undefined) {
//                             console.log('undefined')

//                             // if choice is not undefined
//                         } else {
//                             choiceArray.push(currentQuiz[currentQuestion].choices[i])
//                         }
//                     }
//                     console.log('First question choices:', choiceArray)
//                     // finish loading
//                     setLoadingStatus(true)
//                 }
//             })

//         }


//     })

    /**==============================================
     **              nextQuestion
     *?  What does it do? Handles next question loading and updating
     *=============================================**/
//     function nextQuestion(option) {
//         console.log("User answered with " + option)
//         // set up object for next question
//         setCq({
//             question: currentQuiz[currentQuestion + 1],
//         })
//         console.log('Changing question:', currentQuestionObject)
//         // set current question number
//         setCurrentQuestion(currentQuestion + 1)
//     }
//     // if we are loading a quiz
//     if (loadingQuiz === false) {

//         // show loading screen
//         return (
//             <div>
//                 <Backdrop
//                     sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//                     open={shouldFade}
//                 >
//                     <CircularProgress color="inherit" />
//                 </Backdrop>
//             </div>)

//         // else if we have finished loading
//     } else {
//         if (isDesktopOrLaptop) {
//             // return quiz page
//             return (
//                 <div className='quiz-container'>
//                     {/* Quiz Title */}
//                     <h1>Quiz Title: {currentQuizTitle}</h1>
//                     <hr></hr>
//                     {/* All Question content lies below. */}
//                     <h3>Question #{currentQuestion}</h3>
//                     <h3>{currentQuestionObject.question.title}</h3>
//                     <p>Select an answer from below:</p>
//                     <div className='answer-section'>
//                         {/* For each choice, display a button */}
//                         {currentQuestionObject.question.choices.map((answerOption, index) => (
//                             <Button variant='contained' onClick={() => nextQuestion(answerOption)}>{answerOption}</Button>
//                         ))}
//                     </div>
//                 </div>
//             )
//         } else if (isTabletOrMobile) {
//             // return quiz page
//             return (
//                 <div className='quiz-container-mobile'>
//                     {/* Quiz Title */}
//                     <h1>Quiz Title: {currentQuizTitle}</h1>
//                     <hr></hr>
//                     {/* All Question content lies below. */}
//                     <h3>Question #{currentQuestion}</h3>
//                     <h3>{currentQuestionObject.question.title}</h3>
//                     <p>Select an answer from below:</p>
//                     <Box textAlign='center'>
//                         <div className='answer-section-mobile'>
//                             {/* For each choice, display a button */}
//                             {currentQuestionObject.question.choices.map((answerOption, index) => (
//                                 <Button variant='contained' onClick={() => nextQuestion(answerOption)}>{answerOption}</Button>
//                             ))}
//                         </div>
//                     </Box>
//                 </div>
//             )
//         }

//     }

// }