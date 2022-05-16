/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
* Copyright (c) 2022 QuizPoint
* All rights reserved.
*/


import _, { map } from 'underscore';
// react modules
import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
// jspdf
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTable } from 'react-table'

// database
import { db, dbFunctions } from '../../services/firebase'
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
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HashLoader from "react-spinners/HashLoader";
import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
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
    const [classObject, setClassObject] = useState({})
    let currentTableData = []
    const [quizzesChecked, questionChecked] = useState(0)
    // id reference to uid
    let { id } = useParams()
    //? let currentTableData
    // color for hash loaders
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    const [tabs, setTabs] = useState([])
    const [numOfQuest, setQuestNum] = useState(0)
    const [studentInClass, setStudentInClass] = useState([])
    //use effect hook, no reference
    const [quizIdToView, setQzId] = useState('');
    const [quizToSelect, setSelect] = useState([])
    const handleChange = (event) => {
        setQzId(event.target.value);
        console.log(event.target.value)
    };

    useEffect(() => {
        if (loading) {
            document.title = 'Loading Data | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/classes/${id}`);

            onValue(pathRef, (snapshot) => {
                console.log(snapshot.val())
                console.log(snapshot.val().students)
                for (var studentCode in snapshot.val().students) {
                    console.log(studentCode)
                    studentInClass.push(studentCode)
                }
                let quizReference = snapshot.val().quizzes.active
                setClassObject(snapshot.val())
                console.log(quizReference)
                let optionArray = []
                for (const property in quizReference) {
                    console.log(`${property}: ${quizReference[property].name}`);
                    optionArray.push({ name: quizReference[property].name, id: property, code: quizReference[property].code })
                }

                let quizSelect = optionArray.map((quiz, index) => {
                    return (
                        <MenuItem key={quiz.code + index} value={quiz.code}>{quiz.name}</MenuItem>
                    )
                })
                setSelect(quizSelect)
                console.log(quizToSelect)
                setLoading(false)
            })

        } else {
            document.title = `${classObject.className}'s Report | QuizPoint`
        }
    }, [loading])
    function GenerateTable({ columns, data }) {
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
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.value === undefined) {

                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <CheckBoxOutlineBlankOutlinedIcon style={{ color: 'orange' }}></CheckBoxOutlineBlankOutlinedIcon>
                                        </Tooltip></TableCell>

                                    } else if (cell.value === 'correct') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Correct">
                                            <CheckBoxOutlinedIcon style={{ color: 'green' }}></CheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    } else if (cell.value === 'incorrect') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Incorrect">
                                            <IndeterminateCheckBoxOutlinedIcon style={{ color: 'red' }}></IndeterminateCheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'complete') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Quiz Completed">
                                            <CheckCircleOutlineIcon style={{ color: 'green' }}></CheckCircleOutlineIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <DoDisturbIcon style={{ color: 'red' }}></DoDisturbIcon>
                                        </Tooltip></TableCell>
                                    } else {
                                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    }
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }

    function ReportTable(props) {

        let currentQuiz = quizIdToView
        let columns = [
            {
                Header: 'Student Information',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'name',
                    },
                    {
                        Header: 'Student ID',
                        accessor: 'studentId',
                    },
                    {
                        Header: 'Completed',
                        accessor: 'completed',
                    },

                ],
            },
            {
                Header: 'Quiz',
                columns: [

                ],
            },
        ]
        if (props.type === 'single') {
            if (quizIdToView === '') { } else {

                let tableData = []
                let pathRef = ref(db, `/schools/hvhs/users/${id}/`);


                let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
                onValue(quizRef, (snapshot) => {
                    if (snapshot.val() === null || snapshot.val() === undefined) {
                    } else {
                        setQuestNum(snapshot.val().numofquestions)
                        console.log(numOfQuest)
                        for (var index = 0; index < numOfQuest; index++) {
                            columns[1].columns.push({
                                Header: `Question ${index + 1}`,
                                accessor: `question${index + 1}`,
                            })
                        }
                    }
                })

                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        console.log(snapshot.val())
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        if (snapshot.val().quizzes.active[currentQuiz].progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                            dataForUser.completed = 'complete'
                        } else {
                            dataForUser.completed = 'incomplete'
                        }
                        if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                            console.log('Hello!' + currentQuiz)
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            console.log(quizReference)
                            for (var index = 0; index < quizReference.length; index++) {
                                if (quizReference[index] === undefined) {

                                } else {
                                    console.log(quizReference[index])
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        } else {
                            let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                            console.log(quizReference)
                            for (var index = 0; index < quizReference.length; index++) {
                                if (quizReference[index] === undefined) {

                                } else {
                                    console.log(quizReference[index])
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        }
                    }
                })
                return (
                    <Paper elevation={3} className="paper-fix">
                        <GenerateTable columns={columns} data={tableData} />
                    </Paper>
                )
            }
        } else if (props.type === 'class') {
            let tableData = []

            let studentArray = props.students
            console.log(props)
            let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
            onValue(quizRef, (snapshot) => {
                if (snapshot.val() === null || snapshot.val() === undefined) {
                } else {
                    setQuestNum(snapshot.val().numofquestions)
                    console.log(numOfQuest)
                    for (var index = 0; index < numOfQuest; index++) {
                        columns[1].columns.push({
                            Header: `Question ${index + 1}`,
                            accessor: `question${index + 1}`,
                        })
                    }
                }
            })

            for (var index = 0; index < studentArray.length; index++) {
                console.log(studentArray[index])
                let pathRef = ref(db, `/schools/hvhs/users/${studentArray[index]}/`);
                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        console.log(snapshot.val())
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        if (snapshot.val().quizzes.active[currentQuiz].progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                            dataForUser.completed = 'complete'
                        } else {
                            dataForUser.completed = 'incomplete'
                        }
                        if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                            console.log('Hello!' + currentQuiz)
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            console.log(quizReference)
                            for (var index = 0; index < quizReference.length; index++) {
                                if (quizReference[index] === undefined) {

                                } else {
                                    console.log(quizReference[index])
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        } else {
                            let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                            if (quizReference === undefined) { } else {
                                console.log(quizReference)
                                for (var index = 0; index < quizReference.length; index++) {
                                    if (quizReference[index] === undefined) {

                                    } else {
                                        console.log(quizReference[index])
                                        dataForUser['question' + index] = quizReference[index].status

                                    }
                                }
                            }
                            tableData.push(dataForUser)
                        }
                    }
                })
            }
            return (
                <Paper elevation={3} className="paper-fix">
                    <GenerateTable columns={columns} data={tableData} />
                </Paper>
            )
        }
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

        return (
            <div className='student-report'>
                <div className="student-report-studentinfo">
                    <div className="banner-details">
                        {/* Banner 1 - Details */}
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon>Class Details</h5>
                    </div>
                    <div className="user-content">

                        <div className="user-content-right">
                            {/* Basic Student information */}
                            <p>Class Name: {classObject.className}</p>
                            <p>Class Teacher: {classObject.classCreator}</p>
                            {/* when you click on link, it will send email */}
                        </div>
                    </div>
                </div>
                <div className='student-report-container'>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Quiz</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={quizIdToView}
                                label="Quiz"
                                onChange={handleChange}
                            >
                                {quizToSelect}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className='student-report-table'>
                    <ReportTable type={'class'} students={studentInClass}></ReportTable>
                </div>
            </div>
        )
    }
}