/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
// import statements
import { user } from '../firebase/fb.user.js';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { db, ref } from '../services/firebase.js';
// database
import { db } from '../services/firebase'

// components from libs
import { ref, onValue } from "firebase/database";
// import './ClassHome.css'
import './Quizzes.css'
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
// Material UI for Styled Components
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Fab from '@mui/material/Fab';


/**========================================================================
 **                           Generate Push ID
 *?  What does it do? Generates push ids for firebase records (i.e quizzes, classes, users, etc.)
 *@return type
 *@credit mikelehen https://gist.github.com/mikelehen/3596a30bd69384624c11
 *========================================================================**/
let generatePushID = (function () {
    var PUSH_CHARS =
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var lastPushTime = 0;
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = now === lastPushTime;
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error("We should have converted the entire timestamp.");

        var id = timeStampChars.join("");

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error("Length should be 20.");

        let returnVal = 'QUIZ_' + id
        return returnVal;
    };
})();


export default function Quizzes() {
    const [allQuizzes, setQuizzes] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const shouldFade = true;

    useEffect(() => {
        if (!loading) {
            document.title = 'Loading Quizzes | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/quizzes/`);
            onValue(pathRef, (snapshot) => {
                if (snapshot === undefined || snapshot === null) {
                    console.log("invalid class code")
                } else {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.cache) {
                            return;
                        } else {
                            let quiztoPush = childSnapshot.val()
                            quiztoPush.code = childSnapshot.key
                            allQuizzes.push(quiztoPush)
                        }
                    })
                    setLoading(true)

                    console.log(allQuizzes)

                }
            })
        } else {
            document.title = 'Quizzes | QuizPoint'
        }
    })
    if (!loading) {
        return (
            <div className="loading-container">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    } else {
        let quizCards = allQuizzes.map((quizData, index) => {
            console.log(quizData)
            if (quizData.title === undefined) {
                return null
            } else {
                // just some JSX!
                return (
                    <div className="class-card" key={index}>
                        <Card className="class-card-content">
                            <CardContent>
                                <h6>{quizData.title}</h6>
                            </CardContent>
                            <CardActions>
                                <ButtonGroup size="small" variant="text" color="primary" aria-label="text primary button group">
                                    {/* <Button><AssessmentOutlinedIcon /></Button> */}
                                    <Tooltip title={"Edit " + quizData.title} >
                                        <Button onClick={() => navigate('/tcs/quizzes/edit/' + quizData.code)}><EditOutlinedIcon /></Button>

                                    </Tooltip>
                                </ButtonGroup>
                            </CardActions>
                        </Card>
                    </div>
                )
            }

        })
        return (
            <div className='quizpage'>
                <div className="quiz-header">
                    <h2>Quizzes by your school</h2>
                    <button className="generic-button sml" onClick={() => navigate('/tcs/quizzes/create/' + generatePushID())} >Create Quiz</button>
                    <button className="generic-button sml" onClick={() => navigate('/tcs/quizzes/import/')}>Import Quiz</button>
                </div>
                <div className="quiz-cards">
                    {quizCards}
                </div>

            </div>
        )
    }

}

