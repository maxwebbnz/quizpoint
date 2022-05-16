/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Import statements

// Styles and user import
import { user } from '../firebase/fb.user'
import './UserPage.css'
import './UserPageTeacher.css'

// React and Firebase loads
import { useParams } from "react-router-dom"
import React, { useState, useEffect } from 'react'
// database
import { db } from '../services/firebase'
import { ref, onValue } from "firebase/database";

// Alert handling
import { alert } from '../services/Alert'

// Material UI for Styled Components
import Fade from '@mui/material/Fade';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import Tooltip from '@mui/material/Tooltip';

// Page declerations
let userLoaded
let userLoadedClasses = []
let userLoadedActiveQuiz = []
let userLoadedCompletedQuiz = []

/**==============================================
 **              TeacherStudent
 *?  What does it do? Handles the tcs/user/:id page route
 *@return JSX
 *=============================================**/
export default function TeacherStudent() {
    // set states for use in effect hook
    const [loadingData, setLoadingStatus] = useState(false)
    const [shouldFade, setFade] = useState(true)
    // get parameter of user id
    let { id } = useParams()
    /**======================
     **   useEffect()
     *? Runs whilist states exist
     *========================**/
    useEffect(() => {
        //  if program hasn't loaded yet
        if (!loadingData) {
            // signal back to title
            document.title = 'Loading Student | QuizPoint'
            console.log('Loading Student Page')

            /**==============================================
             **              loadData
             *?  What does it do? Loads data for web page
             *=============================================**/
            function loadData() {
                // declerations to check if component has been loaded
                let quizActiveLoaded = false;
                let classLoaded = false;
                let quizCompletedLoaded = false;
                // console log
                console.log('loading all students data')

                const pathRef = ref(db, `/schools/hvhs/users/${id}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === null) {
                        console.log('ERROR - NO DATA FOUND')
                        alert.error('Student not found', 'No data found for the student you are looking for.')
                        document.title = 'Error | QuizPoint'
                        setFade(false)
                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        userLoaded = data

                        /**======================
                         **   Load Classes
                         *========================**/
                        // if classes do exist, check how many
                        var toBeat = 0;
                        var currentNum = 0
                        // if no classes exist, we don't need to contuine.
                        if (userLoaded.classes.notEnrolled === true) {
                            setLoadingStatus(true)
                        } else {

                            // set number of classes to find
                            for (var a in userLoaded.classes) {
                                ++toBeat
                            }
                            // for each class id, find that class
                            Object.keys(userLoaded.classes).forEach(function (key) {
                                // set path to find
                                let pathRef = ref(db, `/schools/hvhs/classes/${key}`);

                                onValue(pathRef, (snapshot) => {
                                    // if there is no classes, something definelty went wrong.
                                    if (snapshot === undefined || snapshot === null) {
                                        console.log("invalid class code")
                                    } else {
                                        // set up data
                                        const data = snapshot.val()
                                        // a final check for invalid data
                                        if (data === null) {
                                            console.log('no class at this id')
                                        } else {
                                            // add class to array
                                            userLoadedClasses.push(data)
                                            // we have found a class,tick it off
                                            ++currentNum
                                        }
                                    }
                                    // if all classes have been loaded, set status to true
                                    if (currentNum === toBeat) {
                                        classLoaded = true
                                    } else {
                                        // we are still going
                                    }
                                });
                            })
                        }
                        /**======================
                        **   Load Quizzes (active)
                        *========================**/
                        // setup how many quizzes we need to find
                        let quizToBeat = 0;
                        let quizCurrentNum = 0;
                        // we don't check here if there aren't any quizzes, cause the above statement will do that logically.
                        for (var b in userLoaded.quizzes.active) {
                            ++quizToBeat
                        }

                        // for each active quiz
                        Object.keys(userLoaded.quizzes.active).forEach(function (key) {
                            // find data for that quiz
                            let pathRef = ref(db, `/schools/hvhs/quizzes/${key}`);
                            onValue(pathRef, (snapshot) => {
                                // check if data is valid
                                if (snapshot === undefined || snapshot === null) {
                                    console.log("invalid quiz key, or quiz has gone a-wall")
                                } else {
                                    // data found
                                    const data = snapshot.val()
                                    if (data === null) {
                                        // last check
                                        console.log('no quiz exists here')
                                    } else {
                                        // push to array
                                        userLoadedActiveQuiz.push(data)
                                        // tick off
                                        ++quizCurrentNum
                                    }
                                }
                                // if all quizzes have been loaded, set status to true
                                if (quizCurrentNum === quizToBeat) {
                                    quizActiveLoaded = true
                                } else {
                                    // we are still going
                                }

                            });
                        })

                        /**======================
                         **  Load Quizzes (completed)
                        *========================**/

                        // setup how many quizzes we need to find
                        let quizCompletedToBeat = 0;
                        let quizCompletedNum = 0;
                        // we don't check here if there aren't any quizzes, cause the above statement will do that logically.
                        for (var b in userLoaded.quizzes.active) {
                            ++quizCompletedToBeat
                        }
                        //for each quiz
                        Object.keys(userLoaded.quizzes.turnedin).forEach(function (key) {
                            // find data for that quiz
                            let pathRef = ref(db, `/schools/hvhs/quizzes/${key}`);
                            onValue(pathRef, (snapshot) => {
                                if (snapshot === undefined || snapshot === null) {
                                    console.log("invalid quiz key, or quiz has gone a-wall")
                                } else {
                                    // data found
                                    const data = snapshot.val()
                                    if (data === null) {
                                        // last check
                                        console.log('no quiz exists here')
                                    } else {
                                        // push to array
                                        userLoadedCompletedQuiz.push(data)
                                        // tick off
                                        ++quizCompletedNum
                                    }
                                }
                                // if all quizzes have been loaded, set status to true
                                if (quizCompletedNum === quizCompletedToBeat) {
                                    quizCompletedLoaded = true
                                } else {
                                    // we are still going
                                }

                                // if all components have loaded, we can load site
                                if (quizActiveLoaded & classLoaded & quizCompletedLoaded) {
                                    setLoadingStatus(true)
                                } else {
                                    console.log("Still loading at the Historic/Completed section, something is taking a while")
                                }
                            });


                        })

                    }
                })
            }
            // trigger function
            loadData()
        } else {
            // if loaded, set dom title to "Student Name | QuizPoint"
            document.title = userLoaded.name + ' | QuizPoint'
        }
    })

    // if page is loading data
    if (!loadingData) {
        // display spinner
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={shouldFade}
            >
                <CircularProgress color="inherit" />
            </Backdrop>)

        // else data has finished loading
    } else {
        // declare variables
        let userClasses
        // if there are no classes, or we found none
        if (userLoadedClasses.length === 0) {
            userClasses = <div>Not enrolled in any classses.</div>
        } else {
            // map each value in array to have a card
            userClasses = userLoadedClasses.map((classData, index) => {
                // just some JSX!
                return (
                    <div className="class-card" key={index}>
                        <Card className="class-card-content">
                            <CardContent>
                                <h1>{classData.className}</h1>
                            </CardContent>
                            <CardActions>
                                <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                    <Button><AssessmentOutlinedIcon /></Button>
                                    <Button><OpenInNewOutlinedIcon /></Button>
                                    <Button><SchoolOutlinedIcon /></Button>
                                    <Button><PersonRemoveOutlinedIcon /></Button>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    </div>
                )
            })
        }
        // declare variables
        let userActiveQuiz
        // if there are no quizzes, or we found none
        if (userLoadedActiveQuiz.length === 0) {
            userActiveQuiz = <div>{userLoaded.name} has not been assigned any quizzes.</div>
        } else {
            // map each value in array to have a card
            userActiveQuiz = userLoadedActiveQuiz.map((quizData, index) => {
                // just some JSX!
                return (
                    <div className="class-card" key={index}>
                        <Card className="class-card-content">
                            <CardContent>
                                <h6>{quizData.title}</h6>
                            </CardContent>
                            <CardActions>
                                <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                    <Button><AssessmentOutlinedIcon /></Button>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    </div>
                )
            })
        }
        // declare variables
        let userCompletedQuiz
        // if there are no quizzes, or we found none
        if (userLoadedCompletedQuiz.length === 0) {
            userCompletedQuiz = <div>{userLoaded.name} has not completed or turned in any quizzes.</div>
        } else {
            // map each value in array to have a card
            userCompletedQuiz = userLoadedCompletedQuiz.map((quizData, index) => {
                // just some JSX!
                return (
                    <div className="class-card" key={index}>
                        <Card className="class-card-content">
                            <CardContent>
                                <h6>{quizData.title}</h6>
                            </CardContent>
                            <CardActions>
                                <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                    <Button><AssessmentOutlinedIcon /></Button>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    </div>
                )
            })
        }

        // once loaded, return page
        return (
            <Fade in={shouldFade}>
                {/* User Page */}
                <div className='user-page-container'>
                    <div className="user-page-header">
                        {/* Student Overview header */}
                        <h2>Student Overview</h2>
                    </div>
                    {/* Quick Actions (button group) */}
                    <div className="user-page-actions">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button><AssessmentOutlinedIcon></AssessmentOutlinedIcon> Export Quiz Report</Button>
                            <Button><AssignmentOutlinedIcon></AssignmentOutlinedIcon> Assign Quiz</Button>
                            <Button><SchoolOutlinedIcon></SchoolOutlinedIcon> Add Class</Button>
                            <Button><PersonRemoveOutlinedIcon></PersonRemoveOutlinedIcon> Remove Student</Button>
                        </ButtonGroup>
                    </div>
                    <div className="banner-details">
                        {/* Banner 1 - Details */}
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon> Personal Details</h5>
                    </div>
                    <div className="user-content">
                        <div className="user-content-left">
                            {/* User Profile Picture */}
                            <Tooltip title="Image taken from students google account">
                                {/* On image hover, message displayed */}
                                <img alt='User profile' src={userLoaded.picture}></img>
                            </Tooltip>
                        </div>
                        <div className="user-content-right">
                            {/* Basic Student information */}
                            <p>Name: {userLoaded.name}</p>
                            <p>Student ID: {userLoaded.studentID}</p>
                            {/* when you click on link, it will send email */}
                            <p>Email: <a href={'mailto:' + userLoaded.email}>{userLoaded.email}</a></p>
                        </div>
                    </div>
                    <div className="banner-class">
                        {/* Banner 2 - Class */}
                        <h5><SchoolOutlinedIcon></SchoolOutlinedIcon> Classes</h5>
                    </div>
                    <div className="user-classcards">
                        <div className="classCards-row">
                            {/* Mapped Class Cards */}
                            {userClasses}
                        </div>
                    </div>
                    <div className="banner-quiz">
                        {/* Banner 3 - Quiz */}
                        <h5><QuizOutlinedIcon></QuizOutlinedIcon> Quiz History</h5>
                    </div>
                    <div className="user-quizhistory">
                        {/* Quiz Section */}
                        <h4>Currently Assigned</h4>
                        <div className="classCards-row">
                            {/* Mapped Quiz Active Cards */}
                            {userActiveQuiz}
                        </div>
                        <hr></hr>
                        <h4>Historic/Completed </h4>
                        <div className="classCards-row">
                            {/* Mapped Quiz Completed Cards */}
                            {userCompletedQuiz}
                        </div>
                    </div>
                </div >
            </Fade >
        )
    }

}