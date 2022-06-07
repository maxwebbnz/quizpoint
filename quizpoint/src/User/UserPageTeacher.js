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
import { useParams, useNavigate } from "react-router-dom"
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


/**==============================================
 **              TeacherStudent
 *?  What does it do? Handles the tcs/user/:id page route
 *@return JSX
 *=============================================**/
export default function TeacherStudent() {
    // set states for use in effect hook
    const [loadingData, setLoadingStatus] = useState(false)
    const [shouldFade, setFade] = useState(true)
    const [userLoaded, setUserLoaded] = useState({})
    const [userQuizzes, setQuizzes] = useState([])
    const [userClasses, setClasses] = useState([])
    const [userActiveQuiz, setActiveQuiz] = useState([])
    const [userClassesJSX, setClassesJSX] = useState()
    // let userActiveQuiz
    const navigate = useNavigate()
    let { id } = useParams()
    useEffect(() => {
        if (!loadingData) {
            document.title = 'Loading User | QuizPoint'
            function loadData() {
                let pathRef = ref(db, `/schools/hvhs/users/${id}`)
                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null) {
                        console.log("no user found")
                    } else {
                        setUserLoaded(snapshot.val())
                        let data = snapshot.val()
                        console.log(data)
                        console.log(data.classes)

                        Object.keys(data.classes).forEach(key => {
                            let classPath = ref(db, `/schools/hvhs/classes/${key}`)
                            onValue(classPath, (snapshot) => {
                                if (snapshot.val() === null) { } else {
                                    setClasses(prevClasses => [...prevClasses, snapshot.val()])
                                }
                            })
                        })
                        console.log(data.quizzes.active)
                        Object.keys(data.quizzes.active).forEach(key => {
                            setActiveQuiz(prevQuiz => [...prevQuiz, data.quizzes.active[key]])
                        })
                    }
                })
            }
            // load student information
            loadData()
            setLoadingStatus(true)

        } else {
            document.title = `${userLoaded.name} | QuizPoint`
            console.log(userActiveQuiz)
            console.log(userClasses)
        }
    })
    if (loadingData) {
        return (
            <div className='user-page-container'>
                <div className='banner-details'>
                    <InfoOutlinedIcon></InfoOutlinedIcon> {userLoaded.name}
                </div>
                <div className="user-page-actions">
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={() => navigate('/tcs/reports/student/' + userLoaded.uid)}><AssessmentOutlinedIcon></AssessmentOutlinedIcon> View Report</Button>
                        <Button><SchoolOutlinedIcon></SchoolOutlinedIcon> Add Class</Button>
                        <Button><PersonRemoveOutlinedIcon></PersonRemoveOutlinedIcon> Remove Student</Button>
                    </ButtonGroup>
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
                        {userClasses.map((classData, index) => {
                            // just some JSX!
                            return (
                                <div className="class-card" key={index}>
                                    <Card className="class-card-content">
                                        <CardContent>
                                            <h1>{classData.className}</h1>
                                        </CardContent>
                                        <CardActions>
                                            <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                                <Button onClick={() => navigate('/tcs/reports/class/' + classData.code)}><AssessmentOutlinedIcon /></Button>
                                                <Button onClick={() => navigate('/class/' + classData.code)}><OpenInNewOutlinedIcon /></Button>
                                                <Button><SchoolOutlinedIcon /></Button>
                                                <Button><PersonRemoveOutlinedIcon /></Button>
                                            </ButtonGroup>
                                        </CardActions>
                                    </Card>
                                </div>
                            )
                        })
                        }
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
                        {userActiveQuiz.map((quizData, index) => {
                            // just some JSX!
                            return (
                                <div className="class-card" key={index}>
                                    <Card className="class-card-content">
                                        <CardContent>
                                            <h6>{quizData.details.name}</h6>
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
                    </div>
                </div>

            </div>
        )
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
        )
    }


}