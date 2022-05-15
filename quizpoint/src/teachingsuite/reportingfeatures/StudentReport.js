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

import HashLoader from "react-spinners/HashLoader";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
            let pathRef = ref(db, `/schools/hvhs/users/${id}`);

            onValue(pathRef, (snapshot) => {
                console.log(snapshot.val())
                let quizReference = snapshot.val().quizzes.active
                setStudentObject(snapshot.val())
                console.log(quizReference)
                let optionArray = []
                for (const property in quizReference) {
                    console.log(`${property}: ${quizReference[property].name}`);
                    optionArray.push({ name: quizReference[property].name, id: property, code: quizReference[property].code })
                }
                let quizSelect = optionArray.map((quiz) => {
                    return (
                        <MenuItem value={quiz.code}>{quiz.name}</MenuItem>
                    )
                })
                setSelect(quizSelect)
                console.log(quizToSelect)
                setLoading(false)
            })

        }
    })
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
                                    if (cell.value === undefined) {
                                        return <td {...cell.getCellProps()}>Not Completed</td>
                                    } else {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    function ReportTable() {
        let currentQuiz = quizIdToView


        if (quizIdToView === '') { } else {
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

                    ],
                },
                {
                    Header: 'Quiz',
                    columns: [

                    ],
                },
            ]
            let tableData = []
            let pathRef = ref(db, `/schools/hvhs/users/${id}/`);


            let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
            onValue(quizRef, (snapshot) => {
                if (snapshot.val() === null || snapshot.val() === undefined) {
                } else {
                    setQuestNum(snapshot.val().numofquestions)
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

                    let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                    console.log(quizReference)
                    for (var index = 0; index < quizReference.length; index++) {
                        if (quizReference[index] === undefined) {

                        } else {
                            console.log(quizReference[index])
                            dataForUser['question' + index] = quizReference[index].status.charAt(0).toUpperCase() + quizReference[index].status.slice(1);

                        }
                    }
                    console.log(dataForUser)
                    tableData.push(dataForUser)
                    console.log(tableData)
                }
            })
            console.log(columns)
            return (
                <Table columns={columns} data={tableData} />
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
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon> Personal Details</h5>
                    </div>
                    <div className="user-content">
                        <div className="user-content-left">
                            {/* User Profile Picture */}
                            <Tooltip title="Image taken from students google account">
                                {/* On image hover, message displayed */}
                                <img alt='User profile' src={currentStudent.picture}></img>
                            </Tooltip>
                        </div>
                        <div className="user-content-right">
                            {/* Basic Student information */}
                            <p>Name: {currentStudent.name}</p>
                            <p>Student ID: {currentStudent.studentID}</p>
                            {/* when you click on link, it will send email */}
                            <p>Email: <a href={'mailto:' + currentStudent.email}>{currentStudent.email}</a></p>
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
                    <ReportTable></ReportTable>
                </div>
            </div>
        )
    }
}