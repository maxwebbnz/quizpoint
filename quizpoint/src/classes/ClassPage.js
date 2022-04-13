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

// array for
let quizActive = []

export default function ClassPage() {
    const [loading, dataComplete] = useState(false)
    const [classObject, setClass] = useState()
    // const []
    let { classId } = useParams()
    var shouldFade = true;
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
                    if (snapshot === undefined) {
                        console.log('ERROR - NO DATA FOUND')

                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        setClass(data)
                        Object.keys(user.quizzes.active).forEach(function (key) {
                            if (data.quizzes.active[key] !== undefined) {
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
                        // for each student value
                        console.log(data)
                        dataComplete(true)
                        console.log(quizActive)


                        // finished loading, we can show page now
                    }
                })

            }
            loadData()
        }
    })
    if (loading === true) {
        const abc = quizActive.map((qz) =>
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
        );
        console.log(abc)

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
                            {abc}
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