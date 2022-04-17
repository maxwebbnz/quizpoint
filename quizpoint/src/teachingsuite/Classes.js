/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// import statements
import { user } from '../firebase/fb.user.js';
import React, { useState, useEffect } from 'react'
// import { db, ref } from '../services/firebase.js';
// database
import { db } from '../services/firebase'

// components from libs
import { ref, onValue, update, get } from "firebase/database";
// import './ClassHome.css'
import { dbFunctions } from '../services/firebase.js';

// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Fade from '@mui/material/Fade';
import { alert } from '../services/Alert'
import "bootstrap-icons/font/bootstrap-icons.css";

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

let userClasses = []
let foundClasses = []


export default function Classes() {
    const [loading, dataFetch] = useState(false)
    const shouldFade = true;

    useEffect(() => {
        if (loading === true) {
            document.title = ' Classes | QuizPoint'
            console.log('Loaded')
        } else {
            document.title = 'Loading Students | QuizPoint'
            console.log('Loading')


            /**==============================================
             **              loadData()
             *?  What does it do? Load data from Firebase for each student
             *=============================================**/
            function loadData() {
                // console log
                console.log('loading all students data')
                //! this should check for each users role before pushing to array
                // // wait for data
                // onValue(pathRef, (snapshot) => {
                //     // if there is no students, something definelty went wrong.
                //     if (snapshot === undefined) {
                //         console.log('ERROR - NO DATA FOUND')

                //         // if students do exist
                //     } else {
                //         // set placeholder to object of students
                //         const data = snapshot.val()
                //         // for each student value


                //         // finished loading, we can show page now
                //
                //     }
                // })
                var toBeat = 0;
                var currentNum = 0
                for (var a in user.classes) {
                    ++toBeat
                }

                Object.keys(user.classes).forEach(function (key) {
                    console.log(key)
                    let pathRef = ref(db, `/schools/hvhs/classes/${key}`);

                    onValue(pathRef, (snapshot) => {
                        if (snapshot === undefined || snapshot === null) {
                            console.log("invalid class code")
                        } else {
                            const data = snapshot.val()
                            if (data === null) {

                            } else {
                                console.log(data)
                                foundClasses.push(data)
                                ++currentNum
                            }
                        }

                        if (currentNum < toBeat) {
                            console.log('not loaded yet' + currentNum + ' ' + toBeat)
                        } else {
                            dataFetch(true)
                        }
                    })

                    console.log(foundClasses)

                });
            }
            // trigger function
            loadData()
        }
    })
    if (loading === false) {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className="class-home">
                    <div className="class-header">
                        <h2>Loading Information</h2>
                    </div>
                    <div className="class-body">
                        <div className="class-cards">
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                            <Stack spacing={1}>
                                <Skeleton variant="rectangular" width={300} height={200} />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        );


    } else {
        const classCards = foundClasses.map((classInfo) =>
            <div>
                <Card sx={{ width: 275 }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="100"
                            image="https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/12/Gradient_builder_2.jpg"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Taught by {classInfo.classCreator}
                            </Typography>
                            <Typography variant="h4">
                                {classInfo.className}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" href={'/class/' + classInfo.code}>View Class</Button>
                        </CardActions>
                    </CardActionArea>
                </Card>

            </div>
        );
        return (
            <Fade in={shouldFade}>
                <div className="class-home">
                    <div className="class-header">
                        <h2>Classes created by you</h2>
                    </div>
                    <div className="class-body">
                        <div className="class-cards">
                            {classCards}
                        </div>
                    </div>
                    <Box sx={{ '& > :not(style)': { m: 1 }, position: 'absolute', bottom: 16, right: 16 }}>
                        <Fab color="primary" aria-label="add">
                            <h3><i className="bi bi-plus"></i></h3>
                        </Fab>
                    </Box>
                </div>
            </Fade>
        )
    }


}
