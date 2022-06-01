/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


import { useParams, useNavigate } from "react-router-dom"
import { user } from '../firebase/fb.user'
import React, { useState, useEffect } from 'react'
import './ClassPage.css'
// database
import { db } from '../services/firebase'
import { alert } from '../services/Alert'
// components from libs
import { ref, onValue } from "firebase/database";
// compenets from ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import AssignQuiz from "../teachingsuite/AssignQuiz"
import GenerateInvite from "../teachingsuite/GenerateInvite"
// responsive design
import { useMediaQuery } from 'react-responsive'

// array for
let quizActive = []
export default function ClassPage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const navigate = useNavigate()
    const [loading, dataComplete] = useState(false)
    const [classObject, setClass] = useState()
    const [quizCards, addQuizCard] = useState([])
    const [currentNum, setCurrentNum] = useState(0)
    const [toBeat, setToBeat] = useState(0)
    const [shouldFade, fadeEnabled] = useState(true)
    // const []
    let classArray = []
    let { classId } = useParams()
    console.log(classId)
    useEffect(() => {
        if (loading === true) {
            document.title = classObject.className + ' | QuizPoint'

        } else {
            document.title = 'Loading Class | QuizPoint'

            function loadData() {
                console.log("loading class data")
                const pathRef = ref(db, `/schools/hvhs/classes/${classId}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === null) {
                        console.log('ERROR - NO DATA FOUND')
                        alert.error('Class not found', 'No data found for this class, probably does not exist')
                        fadeEnabled(false)
                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        setClass(data)
                        if (data.quizzes === false) {
                            let plceholderArrary = [{ error: 'No quizzes avaliable' }]
                            addQuizCard(plceholderArrary.map((qz) =>
                                <div>
                                    <p>{qz.error}</p>
                                </div>
                            ))
                            dataComplete(true)

                        } else {

                            for (var a in user.quizzes.active) {
                                setToBeat(toBeat + 1)
                            }
                            function loadActiveQuiz() {
                                Object.keys(user.quizzes.active).forEach(function (key) {
                                    if (data.quizzes.active[key] === undefined) {
                                        console.log("error")
                                    } else if (data.quizzes.active[key] !== undefined) {
                                        console.log(key + " match, loading data")
                                        let quizRef = ref(db, `/schools/hvhs/quizzes/${key}`);
                                        onValue(quizRef, (snapshot) => {
                                            console.log(currentNum)

                                            if (snapshot.val() === undefined || snapshot.val() === null) {
                                            } else {
                                                const data = snapshot.val()
                                                console.log(data)
                                                quizActive.push(data)
                                                setCurrentNum(currentNum + 1)
                                                if (toBeat > currentNum) {
                                                    console.log(currentNum)
                                                } else {
                                                    dataComplete(true)
                                                    console.log('Still loading ' + currentNum + ' of ' + toBeat)

                                                }
                                            }

                                        })
                                    }
                                })
                            }
                            if (toBeat === 0) {

                            } else {

                            }
                            dataComplete(true)

                            addQuizCard(quizActive.map((qz) =>
                                <div>
                                    <Card sx={{ minWidth: 275 }}>
                                        <CardContent>
                                            <Typography variant="h3">
                                                {qz.title}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Start Quiz</Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            ))
                            // for each student value
                            console.log(data)

                            console.log(quizActive)


                        }



                        // finished loading, we can show page now
                    }
                })

            }
            loadData()


        }
    })

    //! I CANNOT GET THIS WORKING, Allan did you want to have a try?
    if (loading === true) {
        if (isTabletOrMobile) {
            console.log(quizCards)
            return (
                <Fade in={shouldFade}>
                    <div className="class">
                        <div className="class-header-mobile">
                            <h1>{classObject.className}</h1>
                            <h3>Created by {classObject.classCreator}</h3>
                            <hr></hr>
                        </div>
                        <div className="class-body-mobile">
                            <div className="quizassigned-mobile">
                                <h2>Quizzes Assigned</h2>
                                {quizCards}
                            </div>
                            <hr></hr>
                            <div className="quizcompleted">
                                <h2>Quizzes Completed</h2>
                            </div>
                        </div>

                    </div>
                </Fade>
            )
        } else {
            function returnTeacherActions() {
                console.log(user)
                if (user.role === 'teacher') {
                    console.log(classObject)
                    for (var studentID in classObject.students) {
                        classArray.push(studentID)
                    }
                    return (
                        <>
                            <AssignQuiz classList={classArray} classId={classId}></AssignQuiz>
                            <button className="generic-button sml" onClick={() => { navigate('/tcs/reports/class/' + classId) }} >View Report</button>
                            <GenerateInvite classObject={classObject} classId={classId}></GenerateInvite>
                        </>
                    )
                } else if (user.role === undefined) {
                    return
                }
            }
            console.log(quizCards)
            return (
                <Fade in={shouldFade}>
                    <div className="class">
                        <div className="class-header">
                            <h1>{classObject.className}</h1>
                            <h3>Created by {classObject.classCreator}</h3>
                            <hr></hr>
                        </div>
                        <div className="class-body">
                            {returnTeacherActions()}
                            <div className="quizassigned">
                                <h2>Quizzes Assigned</h2>
                                {quizCards}
                            </div>
                            <hr></hr>
                            <div className="quizcompleted">
                                <h2>Quizzes Completed</h2>
                            </div>
                        </div>
                        <AssignQuiz classList={classArray}></AssignQuiz>
                    </div>
                </Fade>
            )
        }
    } else {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >
        );

    }
}