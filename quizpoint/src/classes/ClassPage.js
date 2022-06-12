/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


/**======================
 **   React Imports
 *========================**/
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
/**======================
 **   Data service Imports
 *========================**/
import { db } from '../services/firebase'
import { user } from '../firebase/fb.user'
import { ref, onValue } from "firebase/database";
/**======================
 **   MUI Imports
 *========================**/
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

/**======================
 **   Teacher Module Imports
 *========================**/
import AssignQuiz from "../teachingsuite/AssignQuiz"
import GenerateInvite from "../teachingsuite/GenerateInvite"
/**======================
 **   Misc Imports
 *========================**/
import { useMediaQuery } from 'react-responsive'
import { alert } from '../services/Alert'
/**======================
 **   Stylesheet Imports
 *========================**/
import './ClassPage.css'

/**========================================================================
 **                           ClassPage
 *?  What does it do? Shows the class page for a class based on ID provided.
 *@return JSX, HTML page content
 *========================================================================**/
export default function ClassPage() {
    // media query for mobile
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    // reference to navigate function
    const navigate = useNavigate()
    // state declerations
    // program loading state
    const [loading, dataComplete] = useState(true)
    // class Object state (current loaded class)
    const [classObject, setClass] = useState()
    // quiz card state, array where each element is a quiz card
    const [quizCards, addQuizCard] = useState([])
    // quizActive state, array where each element is a quiz card
    const [quizActive, setQuizActive] = useState([])
    // shouldFade check if content should fade -> default true
    const [shouldFade, fadeEnabled] = useState(true)
    // each student in the class exists in the class array, unless a teacher
    let classArray = []
    // reference to the params object
    let { classId } = useParams()
    // useeffect loop, loading data
    useEffect(() => {
        // if program has loaded, show different title in DOM
        if (loading === false) {
            // change document title
            document.title = classObject.className + ' | QuizPoint'

            // else program is loading
        } else {
            // change document title
            document.title = 'Loading Class | QuizPoint'
            /**==============================================
            **              loadData()
            *?  What does it do? Load data from Firebase for the classs
            *=============================================**/

            function loadData() {
                // reference to class object
                const pathRef = ref(db, `/schools/hvhs/classes/${classId}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === null) {
                        // handle error
                        // styled alert
                        alert.error('Class not found', 'No data found for this class, probably does not exist')
                        fadeEnabled(false)

                        // if class does exist
                    } else {
                        // data reference for later
                        const data = snapshot.val()
                        // set class object to data grabbed
                        setClass(data)
                        // if there are no quizzes
                        if (data.quizzes === false) {
                            // set up array
                            let plceholderArrary = [{ error: 'No quizzes avaliable' }]
                            // map JSX
                            addQuizCard(plceholderArrary.map((qz) =>
                                <div>
                                    <p>{qz.error}</p>
                                </div>
                            ))
                            // finished data loading, set container.
                            dataComplete(true)
                            // if there are quizzes
                        } else {
                            // for each quiz
                            Object.keys(data.quizzes).forEach((key) => {
                                // if the quiz does not have a name, its legacy and won't work
                                if (data.quizzes[key].name === undefined) {
                                    // skip
                                } else {
                                    // add quiz to array
                                    let quiz = data.quizzes[key]
                                    quizActive.push(quiz)
                                }
                            })
                            // map JSX
                            addQuizCard(quizActive.map((qz) =>
                                // quiz cad
                                <div className="quiz-card">
                                    <Card sx={{ minWidth: 275 }}>
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
                            // finished data loading
                            dataComplete(false)
                        }
                    }
                })

            }
            // load data trigger
            loadData()


        }
    }, [])

    // if program is finshed loading, show page content
    if (!loading) {
        // if client is on a mobile
        if (isTabletOrMobile) {
            // return JSX
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
            // if client is on a desktop
        } else {
            /**==============================================
             **              returnTeacherActions
             *?  What does it do? Returns the teacher actions for the class
             *@return JSX, HTML page content
             *=============================================**/
            function returnTeacherActions() {
                // if the user is a teacher
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
                    // if not, no need to show actions
                } else if (user.role === undefined) {
                    return
                }
            }
            // return JSX
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

        // else if loading, show loading screen
    } else {
        // return JSX, html content
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