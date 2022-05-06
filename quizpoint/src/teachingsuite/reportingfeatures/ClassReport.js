/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'

// ui
import Backdrop from '@mui/material/Backdrop';
import ClockLoader from "react-spinners/ClockLoader";
// database
import { db } from '../../services/firebase'

// components from libs
import { ref, onValue } from "firebase/database";


export default function ClassReport() {
    const navigate = useNavigate()
    const [loadingAll, finshedData] = useState(true)
    const [loadingClassInformation, finishedStep] = useState(true)
    const [shouldFade, setFade] = useState(true)
    const [quizReview, setQuizReview] = useState([])
    const [quizCodes, setQuizCodes] = useState([])
    const [studentsToCheck, setStudents] = useState([])
    const [studentResults, setResults] = useState([])
    let [color, setColor] = useState("#FFFFFF");

    useEffect(() => {
        if (loadingAll) {
            document.title = 'Loading | QuizPoint'
            function loadQuizfromClass() {
                let pathRef = ref(db, `/schools/hvhs/classes/${id}/quizzes/active/`);
                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        alert("No active quizzes found")
                        navigate('/tcs/reporting')
                    } else {
                        snapshot.forEach(quiz => {
                            console.log(quiz.val())
                            quizCodes.push(quiz.val().code)
                            let pathRef = ref(db, `/schools/hvhs/quizzes/${quiz.val().code}/`);
                            onValue(pathRef, (snapshot) => {
                                if (snapshot.val() === undefined || snapshot.val() === null) {
                                    alert('Error: Quiz Does not exist' + quiz.val().code)
                                    navigate('/tcs/reporting')
                                } else {
                                    quizReview.push(quiz.val())

                                }
                            })
                        })
                        // then get students

                        let pathRef = ref(db, `/schools/hvhs/classes/${id}/students/`);
                        onValue(pathRef, (snapshot) => {
                            if (snapshot.val() === null) {
                                console.log('This class is odd man')
                            } else {
                                snapshot.forEach(student => {
                                    studentsToCheck.push(student.val())
                                })
                                // then need to load each student
                                for (var index = 0; index < studentsToCheck.length; index++) {
                                    let pathRef = ref(db, `/schools/hvhs/users/${studentsToCheck[index]}/`);
                                    onValue(pathRef, (snapshot) => {
                                        if (snapshot.val() === null) {
                                            return
                                        } else {
                                            studentsToCheck[index] = {
                                                name: snapshot.val().name,
                                                email: snapshot.val().email,
                                                studentID: snapshot.val().studentID,
                                                quizRef: snapshot.val().quizzes
                                            }


                                            for (var qzIndex = 0; qzIndex < quizCodes.length; qzIndex++) {
                                                let pathRef = ref(db, `/schools/hvhs/quizzes/${quizCodes[qzIndex]}/`);
                                                onValue(pathRef, (snapshot) => {
                                                    if (snapshot.val() === null) {
                                                        return
                                                    } else {
                                                        let questionArray = snapshot.val().questions
                                                        let studentAnswers = studentsToCheck[index].quizRef.active[quizCodes[qzIndex]].answers

                                                        for (var qIndex = 0; qIndex < questionArray.length; qIndex++) {

                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                        console.log(snapshot.val())
                    }
                })
            }
            loadQuizfromClass()
        } else {
            document.title = 'Class Report | QuizPoint'
        }
    })
    let { id } = useParams()
    if (loadingAll) {
        return (<div className="loading-container">
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={shouldFade}
            >
                <ClockLoader color={color} loading={loadingAll} size={70} />
            </Backdrop>
        </div>)
    } else {

    }
    return (
        <h1> {id} </h1>
    )
}