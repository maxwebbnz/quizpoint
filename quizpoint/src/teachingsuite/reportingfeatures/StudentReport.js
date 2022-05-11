/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



// react modules
import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// jspdf
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTable } from 'react-table'

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
import * as htmlToImage from 'html-to-image';
import MUIDataTable from "mui-datatables";

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
    const [loading, setLoading] = useState(true)
    const [currentStudent, setStudentObject] = useState({})
    const [currentTableData, setTableData] = useState([])
    const [quizzesChecked, questionChecked] = useState(0)
    // id reference to uid
    let { id } = useParams()
    //? let currentTableData
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
                        let studentObject = {
                            uid: snapshot.val().uid,
                            name: snapshot.val().name,
                            quizzes: snapshot.val().quizzes,
                        }
                        let studentArray = [studentObject.name]
                        // load quiz information
                        let quizCodes = snapshot.val().quizzes.active
                        // for all quiz codes
                        for (let quizCode in quizCodes) {
                            studentObject.quiz = {}
                            studentObject.quiz[quizCode] = {}
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
                                        // echo to title
                                        console.log('quiz is active')
                                        // reference to a long variable
                                        let quizQuestions = studentObject.quizzes.active[quizCode].answers
                                        let quizReference = studentObject.quizzes.active[quizCode]
                                        let counter = 0;

                                        // for all questions in quiz
                                        for (var index = 0; index < quizQuestions.length; index++) {
                                            counter++
                                            let quizObjectHeader = 'question' + index
                                            // reference for something i cant be bothered typing
                                            let question = quizQuestions[index]
                                            quizReference[index] = {
                                                studentInput: quizReference.answers[index],
                                            }
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
                                                    quizReference[index].answer = 'correct'
                                                    studentArray[index] = 'Correct'
                                                    studentObject[quizObjectHeader] = 'Correct'
                                                    // incorrect, merr merr merr
                                                } else {
                                                    console.log(question + ' is not correct')
                                                    quizReference[index].answer = 'correct'
                                                    studentArray.push('Incorrect')
                                                    studentArray[index] = 'Correct'
                                                    studentObject[quizObjectHeader] = 'Incorrect'

                                                }
                                            }
                                            console.log(quizReference)

                                        }

                                        studentObject.quiz[quizCode] = quizReference
                                        // finishing off with a console log

                                        // if its not active and has been completed
                                    } else if (typeof studentObject.quizzes.active[quizCode] === 'undefined') {
                                        console.log('quiz is turned in')
                                    }
                                }
                            })
                        }
                        setStudentObject(studentObject)
                        setTableData(currentTableData => [...currentTableData, studentObject])
                        // set loading to false
                        setLoading(false)
                        console.log(currentTableData)


                    }

                })
            }
            // execute load student
            loadStudent()
        }
    })
    // window.locatio  n.reload(false);
    const columns = useMemo(
        () => [
            {
                Header: 'Student Information',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'name',
                    },

                ],
            },
            {
                Header: 'Quiz',
                columns: [
                    {
                        Header: '1',
                        accessor: 'question1',
                    },
                    {
                        Header: '2',
                        accessor: 'question2',
                    },
                    {
                        Header: '3',
                        accessor: 'question3',
                    },
                    {
                        Header: '4',
                        accessor: 'question4',
                    },
                ],
            },
        ],
        []
    )

    const data = [{
        name: "Max Webb",
        question1: "Correct",
        question2: "Correct",
        question3: "Correct",
        question4: "Correct"
    }, {
        name: "Maxwell Webb",
        question1: "Correct",
        question2: "Correct",
        question3: "Correct",
        question4: "Correct"
    },
    ]

    const tableData = useMemo(() => currentTableData)

    console.log(data)

    function Table({ columns, data }) {
        // Use the state and functions returned from useTable to build your UI
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({
            columns,
            data,
        })

        // Render the UI for your table
        return (
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }
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


        let userLoaded = {
            uid: "adadawd",
            name: "Max Webb",
            email: '18205mw@hvhs.school.nz',
            studentID: '18205mw',
            picture: 'https://lh3.googleusercontent.com/a-/AOh14Gi4yHlhKDaUDCvUxS_ZgS9OdjYN-bEPabU8kLrm3Q=s96-c',
        }



        console.log(currentTableData)
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
                                <Tab>Select a tab</Tab>
                                <Tab><AssignmentLateOutlinedIcon></AssignmentLateOutlinedIcon> Health and Safety Pt 1.</Tab>
                                <Tab><AssignmentTurnedInOutlinedIcon></AssignmentTurnedInOutlinedIcon> Workplace Safety Pt 2</Tab>

                            </TabList>
                            <TabPanel>
                                <h2>Select a tab to view quic information</h2>
                            </TabPanel>
                            <TabPanel>
                                <div id="report">
                                    <Table columns={columns} data={tableData} />

                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}