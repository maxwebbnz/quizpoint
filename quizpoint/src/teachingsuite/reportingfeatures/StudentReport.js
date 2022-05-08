/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



// react modules
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// database
import { db } from '../../services/firebase'
// components from libs
import { ref, onValue } from "firebase/database";
// mui
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import HashLoader from "react-spinners/HashLoader";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// css
import './StudentReport.css'
/**==============================================
 **              StudentReport()
 *?  What does it do? The basis of indivual student reports
 *=============================================**/
export default function StudentReport() {
    // states
    const [loading, setLoading] = useState(false)
    const [studentObject, setStudentObject] = useState({})
    // id reference to uid
    let { id } = useParams()

    // color for hash loaders
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    //use effect hook, no reference
    useEffect(() => {
        // if program is loading
        if (loading) {
            // echo to title
            document.title = 'Loading Student | QuizPoint'
            /**======================
             **   LoadStudents
             *? Loads student data from firebase and is the brains of module
             *========================**/
            function loadStudent() {
                // reference to student id
                let pathRef = ref(db, `/schools/hvhs/users/${id}`)
                //on value
                onValue(pathRef, (snapshot) => {
                    // if snapshot undefined
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        console.log("invalid student id")
                    } else {
                        // set student object
                        setStudentObject(snapshot.val())
                        // load quiz information
                        let quizCodes = snapshot.val().quizzes.active
                        // for all quiz codes
                        for (let quizCode in quizCodes) {

                            //? in theory you can make the row in here, so therefore each student has an row.
                            // get quiz data
                            let pathRef = ref(db, `/schools/hvhs/quizzes/${quizCode}`)

                            onValue(pathRef, (snapshot) => {
                                // if snapshot undefined, else
                                if (snapshot.val() === undefined || snapshot.val() === null) { } else {
                                    // set quiz object
                                    let quiz = snapshot.val()
                                    // set user ref
                                    let userReference = studentObject.quizzes
                                    // if quiz exists in an active path
                                    if (typeof studentObject.quizzes.active[quizCode] !== 'undefined') {

                                        // echo
                                        console.log('quiz is active')
                                        // reference to a long variable
                                        let quizQuestions = studentObject.quizzes.active[quizCode].answers
                                        // for all questions in quiz
                                        for (var index = 0; index < quizQuestions.length; index++) {
                                            // reference for something i cant be bothered typing
                                            let question = quizQuestions[index]
                                            // testing
                                            console.log(quiz.questions)
                                            // if its empty (which it will be always 1 question (unless model changes))
                                            if (!quiz.questions[index]) {
                                                console.log(index)

                                                // nevermind, its there
                                            } else {
                                                // they got it!
                                                if (question === quiz.questions[index].answer) {
                                                    console.log('correct')
                                                    studentObject.quizzes.active[quizCode].answers[index] = 'correct'
                                                    // incorrect, merr merr merr
                                                } else {
                                                    console.log(question + ' is not correct')
                                                    studentObject.quizzes.active[quizCode].answers[index] = 'incorrect'
                                                }
                                            }
                                        }
                                        // finishing off with a console log
                                        console.log(studentObject)

                                        // if its not active and has been completed
                                    } else if (typeof studentObject.quizzes.active[quizCode] === 'undefined') {
                                        console.log('quiz is turned in')
                                    }
                                }
                            })
                        }
                        // set loading to false
                        setLoading(false)
                    }

                })
            }
            // execute load student
            loadStudent()
        }
    })
    // if loading
    if (loading) {
        return (
            // loading banner
            <div className="loading">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <HashLoader color={color} loading={loading} size={70} />

                </Backdrop>
            </div>
        )
    } else {
        const exampleData = [
            {
                uid: 'abcdaaedojaodj01230213',
                name: 'Max Webb',
                questions: {
                    1: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },
                    2: 'incorrect',
                    3: 'incorrect',
                    4: 'incorrect',
                    5: 'incorrect',
                }
            }
        ]
        const exampleDataCorrect = [
            {
                uid: 'abcdaaedojaodj01230213',
                name: 'Max Webb',
                questions: {
                    1: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },
                    2: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },
                    3: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },
                    4: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },

                    5: {
                        answer: 'correct',
                        question: 'What is the capital of the United States?',
                    },

                }
            }
        ]
        let userLoaded = {
            uid: exampleData[0].uid,
            name: exampleData[0].name,
            email: '18205mw@hvhs.school.nz',
            studentID: '18205mw',
            picture: 'https://lh3.googleusercontent.com/a-/AOh14Gi4yHlhKDaUDCvUxS_ZgS9OdjYN-bEPabU8kLrm3Q=s96-c',
        }
        return (
            <div className="student-report">
                <div className="student-report-studentinfo">
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
                </div>
                <div className="student-report-container">
                    <div className="student-report-header">
                        <h5>Quizzes</h5>
                        <Tabs>
                            <TabList>
                                <Tab><AssignmentLateOutlinedIcon></AssignmentLateOutlinedIcon> Health and Safety Pt 1.</Tab>
                                <Tab><AssignmentTurnedInOutlinedIcon></AssignmentTurnedInOutlinedIcon> Workplace Safety Pt 2</Tab>

                            </TabList>

                            <TabPanel>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Student Name</TableCell>
                                                <Tooltip title="What is this power tool?">
                                                    <TableCell align="right">1</TableCell>
                                                </Tooltip>
                                                <TableCell align="right">2</TableCell>
                                                <TableCell align="right">3</TableCell>
                                                <TableCell align="right">4</TableCell>
                                                <TableCell align="right">5</TableCell>
                                                <TableCell align="right">6</TableCell>
                                                <TableCell align="right">7</TableCell>
                                                <TableCell align="right">8</TableCell>
                                                <TableCell align="right">9</TableCell>
                                                <TableCell align="right">10</TableCell>
                                                <TableCell align="right">11</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {exampleData.map((row) => (
                                                <TableRow
                                                    key={row.uid}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    {row.questions[1].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[2].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[3].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[4].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                            <TabPanel>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Student Name</TableCell>
                                                <Tooltip title="What is this power tool?">
                                                    <TableCell align="right">1</TableCell>
                                                </Tooltip>
                                                <TableCell align="right">2</TableCell>
                                                <TableCell align="right">3</TableCell>
                                                <TableCell align="right">4</TableCell>
                                                <TableCell align="right">5</TableCell>
                                                <TableCell align="right">6</TableCell>
                                                <TableCell align="right">7</TableCell>
                                                <TableCell align="right">8</TableCell>
                                                <TableCell align="right">9</TableCell>
                                                <TableCell align="right">10</TableCell>
                                                <TableCell align="right">11</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {exampleDataCorrect.map((row) => (
                                                <TableRow
                                                    key={row.uid}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    {row.questions[1].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[2].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[3].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[4].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}
                                                    {row.questions[5].answer === 'correct' ? <TableCell align="right"><CheckCircleOutlineIcon style={{ color: 'green' }} /></TableCell> : <TableCell align="right"><DoDisturbIcon style={{ color: 'red' }} /></TableCell>}

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}