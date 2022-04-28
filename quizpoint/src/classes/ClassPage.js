/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


import { useParams } from "react-router-dom"
import { user } from '../firebase/fb.user'
import React, { useState, useEffect } from 'react'
import './ClassPage.css'
// database
import { db } from '../services/firebase'
import { alert } from '../services/Alert'
// components from libs
import { ref, onValue, update, get } from "firebase/database";
// compenets from ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Fade from '@mui/material/Fade';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// responsive design
import { useMediaQuery } from 'react-responsive'

// array for
let quizActive = []
let quizCards = []
export default function ClassPage() {
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    const [loading, dataComplete] = useState(false)
    const [classObject, setClass] = useState()
    const [quizCards, addQuizCard] = useState([])
    const [shouldFade, fadeEnabled] = useState(true)
    // const []
    let { classId } = useParams()
    console.log(classId)
    useEffect(() => {
        if (loading === true) {
            document.title = 'Loaded | QuizPoint'

        } else {
            document.title = 'Loading Class Information | QuizPoint'


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
                            Object.keys(user.quizzes.active).forEach(function (key) {
                                if (data.quizzes.active[key] === undefined) {
                                    console.log("error")
                                } else if (data.quizzes.active[key] !== undefined) {
                                    console.log(key + " match, loading data")
                                    let quizRef = ref(db, `/schools/hvhs/quizzes/${key}`);

                                    onValue(quizRef, (snapshot) => {
                                        if (snapshot === undefined || snapshot === null) {

                                        } else {
                                            const data = snapshot.val()
                                            console.log(data)
                                            quizActive.push(data)
                                        }
                                    })
                                }
                            })

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
                            dataComplete(true)

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
                            <div className="quizassigned">
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