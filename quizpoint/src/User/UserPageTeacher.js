/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Import statements
import { useParams } from "react-router-dom"
import { user } from '../firebase/fb.user'
import './UserPage.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import React, { useState, useEffect } from 'react'
// database
import { db } from '../services/firebase'
import { ref, onValue } from "firebase/database";

import './UserPageTeacher.css'
// ui
import Fade from '@mui/material/Fade';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

let userLoaded

export default function TeacherStudent() {
    const [loadingData, setLoadingStatus] = useState(true)
    const [shouldFade, setFade] = useState(true)
    // get parameter
    let { id } = useParams()
    useEffect(() => {
        if (!loadingData) {
            document.title = 'Loading Student | QuizPoint'
            console.log('Loading')
            function loadData() {
                // console log
                console.log('loading all students data')
                //! this should check for each users role before pushing to array
                const pathRef = ref(db, `/schools/hvhs/users/${id}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === undefined) {
                        console.log('ERROR - NO DATA FOUND')
                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        // for each student value
                        userLoaded = data
                        // set loading status
                        setLoadingStatus(true)
                    }
                })
            }
            // trigger function
            loadData()
        }
    })

    if (!loadingData) {
        return (
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={shouldFade}
            >
                <CircularProgress color="inherit" />
            </Backdrop>)
    } else {
        return (
            <Fade in={shouldFade}>

                <div className='user-page-container'>
                    <div className="user-page-header">
                        <h2>View Student</h2>
                    </div>
                    <div className="user-page-actions">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button><AssessmentOutlinedIcon></AssessmentOutlinedIcon> Export Quiz Report</Button>
                            <Button><AssignmentOutlinedIcon></AssignmentOutlinedIcon> Assign Quiz</Button>
                            <Button><SchoolOutlinedIcon></SchoolOutlinedIcon> Change Class</Button>
                            <Button><PersonRemoveOutlinedIcon></PersonRemoveOutlinedIcon> Remove Student</Button>
                        </ButtonGroup>
                    </div>
                    <div className="banner-details">
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon> Personal Details</h5>
                    </div>
                    <div className="user-content">
                        <div className="user-content-left">
                            <img alt='User profile' src={'https://lh3.googleusercontent.com/a-/AOh14Gi4yHlhKDaUDCvUxS_ZgS9OdjYN-bEPabU8kLrm3Q=s96-c'}></img>
                        </div>
                        <div className="user-content-right">
                            <p>Name: Max Webb</p>
                            <p>Student ID: 18205mw</p>
                            <p>Email: <a href='mailto:18205mw@hvhs.school.nz'>18205mw@hvhs.school.nz</a></p>
                        </div>
                    </div>
                    <div className="banner-class">
                        <h5><SchoolOutlinedIcon></SchoolOutlinedIcon> Classes</h5>
                    </div>
                    <div className="user-classcards">
                        <div className="classCards-row">
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <h2>9PTEC</h2>
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="remove class">
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="open in new window">
                                        <OpenInNewOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="export class report">
                                        <AssignmentOutlinedIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <h2>10PTEC</h2>
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="remove class">
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="open in new window">
                                        <OpenInNewOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="export class report">
                                        <AssignmentOutlinedIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <h2>10PTEC B</h2>
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="remove class">
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="open in new window">
                                        <OpenInNewOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="export class report">
                                        <AssignmentOutlinedIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <h2>12PTEC C</h2>
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="remove class">
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="open in new window">
                                        <OpenInNewOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="export class report">
                                        <AssignmentOutlinedIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                            <Card sx={{ minWidth: 275 }}>
                                <CardContent>
                                    <h2>9PTEC Line 3</h2>
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="remove class">
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="open in new window">
                                        <OpenInNewOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="export class report">
                                        <AssignmentOutlinedIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </div>
                    </div>
                    <div className="banner-quiz">
                        <h5><QuizOutlinedIcon></QuizOutlinedIcon> Quiz History</h5>
                    </div>
                    <div className="user-quizhistory">
                        <h4>Currently Assigned</h4>
                        <hr></hr>
                        <h4>Historic/Completed </h4>
                    </div>

                </div >
            </Fade >

        )
    }

}