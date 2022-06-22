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
import ButtonGroup from '@mui/material/ButtonGroup';

import AssignQuiz from "../teachingsuite/AssignQuiz"
import GenerateInvite from "../teachingsuite/GenerateInvite"
// responsive design
import { useMediaQuery } from 'react-responsive'

// array for
export default function ClassPage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const navigate = useNavigate()
    const [loading, dataComplete] = useState(false)
    const [classObject, setClass] = useState()
    const [quizCards, addQuizCard] = useState([])
    const [quizActive, setQuizActive] = useState([])
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
                            Object.keys(data.quizzes).forEach((key) => {
                                if (data.quizzes[key].name === undefined) {
                                    // skip
                                } else {
                                    console.log(key)
                                    let quiz = data.quizzes[key]
                                    quizActive.push(quiz)
                                }

                            })
                            addQuizCard(quizActive.map((qz) =>
                                <div className="quiz-card">
                                    <Card sx={{ width:280, height:310}}>
                                        <CardContent>
                                            <Typography variant="h6">
                                                {qz.name}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => navigate(`/quiz/${qz.code}`)}>Start Quiz</Button>
                                        </CardActions>
                                    </Card>
                                </div>
                            ))
                            // for each student value
                            console.log(data)

                            console.log(quizActive)
                            dataComplete(true)

                        }



                        // finished loading, we can show page now
                    }
                })

            }
            loadData()


        }
    }, [loading])

    //! I CANNOT GET THIS WORKING, Allan did you want to have a try?
    if (loading === true) {
        if (isTabletOrMobile) {
            console.log(quizCards)
            return (
                <Fade in={shouldFade}>
                    <div className="class-page-mobile">
                        <div className="class-header-mobile">
                            <h1>{classObject.className}</h1>
                        </div>
                        <div className="class-body-mobile">
                            <div className="quizassigned-mobile">
                                <h2>Quizzes Assigned</h2>
                                <hr></hr>
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
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                <AssignQuiz classList={classArray} classId={classId}></AssignQuiz>
                                <Button  onClick={() => { navigate('/tcs/reports/class/' + classId) }} >View Report</Button>
                                <GenerateInvite classObject={classObject} classId={classId}></GenerateInvite>
                            </ButtonGroup>
                        </>
                    )
                } else if (user.role === undefined) {
                    return
                }
            }
            console.log(quizCards)
            return (
                <Fade in={shouldFade}>
                    <div className="class-page">
                        <div className="class-header">
                            <h1>{classObject.className}</h1>
                            <hr></hr>
                        </div>
                        <div className="class-body">
                            {returnTeacherActions()}
                            <div className="quizassigned">
                                <h2>Quizzes Assigned</h2>
                                <div className="quiz-grid">
                                    {quizCards}

                                </div>
                            </div>
                            <hr></hr>
                            <div className="quizcompleted">
                                <h2>Quizzes Completed</h2>
                                <p>Feature not yet complete</p>
                            </div>
                        </div>
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