/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



// react modules
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// database
import { db } from '../../services/firebase'
// components from libs
import { ref, onValue } from "firebase/database";
// mui
import Backdrop from '@mui/material/Backdrop';
import HashLoader from "react-spinners/HashLoader";

/**==============================================
 **              StudentReport()
 *?  What does it do? The basis of indivual student reports
 *=============================================**/
export default function StudentReport() {
    // states
    const [loading, setLoading] = useState(true)
    const [studentObject, setStudentObject] = useState({})
    // id reference to uid
    let { id } = useParams()

    // color for hash loaders
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    //use effect hook, no reference
    useEffect(() => {
        // if program is loading
        if (loading) {
            // echo to title
            document.title = 'Loading Student | QuizPoint'
            /**======================
             **   LoadStudents
             *? Loads student data from firebase and is the brains of module
             *========================**/
            function loadStudent() {
                // reference to student id
                let pathRef = ref(db, `/schools/hvhs/users/${id}`)
                //on value
                onValue(pathRef, (snapshot) => {
                    // if snapshot undefined
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        console.log("invalid student id")
                    } else {
                        // set student object
                        setStudentObject(snapshot.val())
                        // load quiz information
                        let quizCodes = snapshot.val().quizzes.active
                        // for all quiz codes
                        for (let quizCode in quizCodes) {
                            // get quiz data
                            let pathRef = ref(db, `/schools/hvhs/quizzes/${quizCode}`)

                            onValue(pathRef, (snapshot) => {
                                // if snapshot undefined, else
                                if (snapshot.val() === undefined || snapshot.val() === null) { } else {
                                    // set quiz object
                                    let quiz = snapshot.val()
                                    // set user ref
                                    let userReference = studentObject.quizzes
                                    // if quiz exists in an active path
                                    if (typeof studentObject.quizzes.active[quizCode] !== 'undefined') {

                                        // echo
                                        console.log('quiz is active')
                                        // reference to a long variable
                                        let quizQuestions = studentObject.quizzes.active[quizCode].answers
                                        // for all questions in quiz
                                        for (var index = 0; index < quizQuestions.length; index++) {
                                            // reference for something i cant be bothered typing
                                            let question = quizQuestions[index]
                                            // testing
                                            console.log(quiz.questions)
                                            // if its empty (which it will be always 1 question (unless model changes))
                                            if (!quiz.questions[index]) {
                                                console.log(index)

                                                // nevermind, its there
                                            } else {
                                                // they got it!
                                                if (question === quiz.questions[index].answer) {
                                                    console.log('correct')
                                                    studentObject.quizzes.active[quizCode].answers[index] = 'correct'
                                                    // incorrect, merr merr merr
                                                } else {
                                                    console.log(question + ' is not correct')
                                                    studentObject.quizzes.active[quizCode].answers[index] = 'incorrect'
                                                }
                                            }
                                        }
                                        // finishing off with a console log
                                        console.log(studentObject)

                                        // if its not active and has been completed
                                    } else if (typeof studentObject.quizzes.active[quizCode] === 'undefined') {
                                        console.log('quiz is turned in')
                                    }
                                }
                            })
                        }
                        // set loading to false
                        setLoading(false)
                    }

                })
            }
            // execute load student
            loadStudent()
        }
    })
    // if loading
    if (loading) {
        return (
            // loading banner
            <div className="loading">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <HashLoader color={color} loading={loading} size={70} />

                </Backdrop>
            </div>
        )
    } else {
        return (
            <div className="student-report">
                <h1>Student Report</h1>
            </div>
        )
    }
}