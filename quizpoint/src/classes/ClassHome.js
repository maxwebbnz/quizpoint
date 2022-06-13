/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 *
 */


/**======================
 **   React Imports
 *========================**/
import React, { useState, useEffect } from 'react'
/**======================
 **   Data service Imports
 *========================**/
import { db } from '../services/firebase'
import { user } from '../firebase/fb.user.js';
import { ref, onValue } from "firebase/database";
/**======================
 **   MUI Imports
 *========================**/
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
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/**======================
 **   Media Query Imports
 *========================**/
import { useMediaQuery } from 'react-responsive'
/**======================
 **   Stylesheet Imports
 *========================**/
import './ClassHome.css'


/**========================================================================
 **                           Classes
 *?  What does it do? Shows all classes, and handles home page when authed
 *@return JSX, html rendered content
 *========================================================================**/
export default function Classes() {
    // found classes array definition
    let foundClasses = []
    // mobile device detection
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    // states defined
    // loading state
    const [loading, dataFetch] = useState(false)
    // enrollment state
    const [enrolled, setEnrollment] = useState(true)
    // should program fade content? yes
    const shouldFade = true;

    // useEffect to fetch data
    useEffect(() => {
        // if loading data has finished
        if (loading === true) {
            // set document title
            document.title = ' Classes | QuizPoint'

        } else {
            // set document title
            document.title = 'Loading Students | QuizPoint'


            /**==============================================
             **              loadData()
             *?  What does it do? Load data from Firebase for each student
             *=============================================**/
            function loadData() {
                // base declerations
                // toBeat => classes to load
                var toBeat = 0;
                //  currentNum => current number of classes loaded
                var currentNum = 0
                // for each class in the class list locally
                for (var a in user.classes) {
                    // increment toBeat
                    ++toBeat
                }

                // for each class in the class list locally
                Object.keys(user.classes).forEach(function (key) {
                    // if user is not enrolled
                    if (key === 'notEnrolled') {
                        // finished here
                        setEnrollment(false)
                        dataFetch(true)
                        // user is enrolled in a class
                    } else {
                        // set state properly
                        setEnrollment(true)
                        // trim class key
                        let trimmedKey = key.trim()
                        // get class from firebase
                        // path reference to class
                        let pathRef = ref(db, `/schools/hvhs/classes/${trimmedKey}`);
                        // get class from firebase (on value event)
                        onValue(pathRef, (snapshot) => {
                            // content exists -> false
                            if (snapshot.val() === undefined || snapshot.val() === null) {
                                // error handle
                                console.log("invalid class code")

                                // content exists -> true
                            } else {
                                // set data
                                const data = snapshot.val()
                                // if data is again, invaild
                                if (data === null) {
                                    console.log("invalid class code")

                                    // it isn't, we can move on
                                } else {
                                    // push to array
                                    foundClasses.push(data)
                                    // increment currentNum
                                    ++currentNum
                                }
                            }
                            // if all classes have been loaded -> false
                            if (currentNum < toBeat) {
                                console.log('not loaded yet' + currentNum + ' ' + toBeat)
                                console.log(foundClasses)

                                // if all classes have been loaded -> true
                            } else {
                                dataFetch(true)
                            }
                        })
                    }
                });
            }
            // trigger function
            loadData()
        }
    }, [])
    // if program is loading?
    if (loading === false) {
        // return loading screen and dialog
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        );

        // finished loading
    } else {
        // base decleration for class cards
        let classCards
        // if user is enrolled
        if (enrolled === true) {
            // for each class in array
            // generate card
            classCards = foundClasses.map((classInfo) =>
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
            // user is not enrolled
        } else {
            classCards = <div>
                <p>No classes</p>
            </div>
        }
        // if user uses a mobile
        if (isTabletOrMobile) {
            return (
                <Fade in={shouldFade}>
                    <div className="class-home">
                        <div className="class-header">
                            <h2>Your Classes</h2>
                        </div>
                        <div className="class-body">
                            <div className="class-cards-mobile">
                                {classCards}
                            </div>

                        </div>

                    </div>
                </Fade>
            )
        }
        // return desktop application
        else {

            // JSX
            return (
                <Fade in={shouldFade}>
                    <div className="class-home">
                        <div className="class-header">
                            <h2>Your Classes</h2>
                        </div>
                        <div className="class-body">
                            <div className="class-cards">
                                {classCards}
                            </div>

                        </div>

                    </div>
                </Fade>
            )
        }
    }


}

