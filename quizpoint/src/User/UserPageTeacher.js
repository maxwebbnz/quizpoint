/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Import statements
import { useParams } from "react-router-dom"
import { user } from '../firebase/fb.user'
import './UserPage.css'
import { Card, ListGroup } from 'react-bootstrap';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import React, { useState, useEffect } from 'react'
// database
import { db } from '../services/firebase'
import { ref, onValue } from "firebase/database";

import './UserPageTeacher.css'
// ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
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
            <div className='user-page-container'>
                <div className="user-page-header">
                    <h2>View Student</h2>
                </div>
                <div className="user-page-actions">
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
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
                <div className="banner-quiz">
                    <h5><QuizOutlinedIcon></QuizOutlinedIcon> Quiz History</h5>
                </div>
                <div className="user-quizhistory">
                    <h4>Currently Assigned</h4>
                    <hr></hr>
                    <h4>Historic/Completed </h4>
                </div>
            </div>
        )
    }

}