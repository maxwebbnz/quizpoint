/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
* Copyright (c) 2022 QuizPoint
* All rights reserved.
*/


/**========================================================================
 * *                          ClassReport Module
 *========================================================================**/


/**======================
 **   React Imports
 *========================**/
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// jspdf
/**======================
 **   Data Service Imports
 *========================**/
import { db } from '../../services/firebase'
import { user } from '../../firebase/fb.user.js';
import { ref, onValue } from "firebase/database";
/**======================
 **   Data Handling Imports
 *========================**/
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTable } from 'react-table'
/**======================
 **   Material UI Imports
 *========================**/
import Backdrop from '@mui/material/Backdrop';
import TableToExcel from "@linways/table-to-excel";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
/**======================
 **   Icons from MUI Imports
 *========================**/
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
/**======================
 **   Hash Loader Import
 *========================**/
import HashLoader from "react-spinners/HashLoader";

/**======================
 **   Stylesheet Imports
 *========================**/
import './StudentReport.css'
/**==============================================
 **              StudentReport()
*?  What does it do? The basis of indivual student reports
*=============================================**/
export default function StudentReport() {
    // states
    const [loading, setLoading] = useState(true)
    const [classObject, setClassObject] = useState({})

    // id reference to uid
    let { id } = useParams()
    // color for hash loaders
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    const [numOfQuest, setQuestNum] = useState(0)
    const [studentInClass, setStudentInClass] = useState([])
    //use effect hook, no reference
    const [quizIdToView, setQzId] = useState('');
    const [quizToSelect, setSelect] = useState([])
    // variables for pdfs and excel documents
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    /**==============================================
     **              handleChange
     *?  What does it do? Local function to handle input changes to quiz
     *@param event object
     *@return sets to state
     *=============================================**/
    const handleChange = (event) => {
        setQzId(event.target.value);
        console.log(event.target.value)
    };


    /**==============================================
     **              useEffect
     *?  What does it do? Runs a hook everytime loading state changes
     *@return JSX
     *=============================================**/
    useEffect(() => {
        // if program is still loading
        if (loading) {
            // set title to loading
            document.title = 'Loading Data | QuizPoint'
            // set path to read
            let pathRef = ref(db, `/schools/hvhs/classes/${id}`);
            // on value change
            onValue(pathRef, (snapshot) => {
                // for each student in class
                for (var studentCode in snapshot.val().students) {
                    // push to the object
                    studentInClass.push(studentCode)
                }
                // all quizzes active in the class
                let quizReference = snapshot.val().quizzes.active
                // set class object up
                setClassObject(snapshot.val())
                // option array => dropdown
                let optionArray = []
                // for each property in the quizReference object
                for (const property in quizReference) {
                    // push to the option array
                    optionArray.push({ name: quizReference[property].name, id: property, code: quizReference[property].code })
                }
                // for each quiz in the option array, map a option
                let quizSelect = optionArray.map((quiz, index) => {
                    // e.g Health and Safety quiz with the key of abcef1 and a value of abcef

                    return (
                        <MenuItem key={quiz.code + index} value={quiz.code}>{quiz.name}</MenuItem>
                    )
                })
                // set the select box up
                setSelect(quizSelect)
                // finished loading
                setLoading(false)
            })

        } else {
            // set title to class name
            document.title = `${classObject.className}'s Report | QuizPoint`
        }
    }, [loading])


    /**==============================================
     **              GeneratePDFTable
     *?  What does it do? Uses React-Table to generate a table
     *@param columns array of objects
     *@param data array of objects
     *@return a hidden table
     *=============================================**/
    function GeneratePDFTable({ columns, data }) {

        // Use following states and props for table
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

        // Render UI for table (Material UI)
        return (
            // set up table ID
            <Table id="reportTableToExport" {...getTableProps()}>
                <TableHead>
                    {/* for each header group */}
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // I.e Question 1, Student Name, etc
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        // for each row
                        prepareRow(row)
                        // prepare the row
                        return (
                            // for each row indivually (cell)
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // if cell doesn't exist
                                    if (cell.value === undefined) {
                                        // user hasn't completed
                                        return <TableCell {...cell.getCellProps()}>N/C</TableCell>

                                    } else if (cell.value === 'correct') {
                                        // user has completed and answered correctly
                                        return <TableCell {...cell.getCellProps()}>
                                            Y
                                        </TableCell>
                                    } else if (cell.value === 'incorrect') {
                                        // user has completed and answered incorrectly
                                        return <TableCell {...cell.getCellProps()}>
                                            N
                                        </TableCell>
                                    }
                                    else if (cell.value === 'complete') {
                                        // user has completed quiz
                                        return <TableCell {...cell.getCellProps()}>
                                            Quiz Complete
                                        </TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        // user has not completed quiz
                                        return <TableCell {...cell.getCellProps()}>
                                            Not Complete
                                        </TableCell>
                                    } else {
                                        // return other data
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

    /**==============================================
     **              GenerateTable
     *?  What does it do? Uses React-Table to generate a table
     *@param columns array of objects
     *@param data array of objects
     *@return a Material UI table
     *=============================================**/
    function GenerateTable({ columns, data }) {
        // Use following states and props for table
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

        // Render UI (Material Table)
        return (
            <Table {...getTableProps()}>
                <TableHead>
                    {/* for each header group */}
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // I.e Question 1, Student Name, etc
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {/* for each row */}
                    {rows.map((row, i) => {
                        // prepare the row
                        prepareRow(row)
                        return (
                            // for each row indivually (cell)
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // if value doesn't exist, they probably haven't completed it
                                    if (cell.value === undefined) {
                                        // return Empty Box with a color of orange and a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <CheckBoxOutlineBlankOutlinedIcon style={{ color: 'orange' }}></CheckBoxOutlineBlankOutlinedIcon>
                                        </Tooltip></TableCell>

                                    } else if (cell.value === 'correct') {
                                        // return a green checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Correct">
                                            <CheckBoxOutlinedIcon style={{ color: 'green' }}></CheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    } else if (cell.value === 'incorrect') {
                                        // return a red checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Incorrect">
                                            <IndeterminateCheckBoxOutlinedIcon style={{ color: 'red' }}></IndeterminateCheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'complete') {
                                        // return a green checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Quiz Completed">
                                            <CheckCircleOutlineIcon style={{ color: 'green' }}></CheckCircleOutlineIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        // return a red checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <DoDisturbIcon style={{ color: 'red' }}></DoDisturbIcon>
                                        </Tooltip></TableCell>
                                    } else {
                                        // return other data
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

    /**==============================================
     **              ReportTable
     *?  What does it do? Builds and pulls data for report table
     *@param props object
     *@return GenerateTable and GeneratePDFTable respectively.
     *=============================================**/
    function ReportTable(props) {
        // let current quiz ID be the quizIdToView (i.e. abcef)
        let currentQuiz = quizIdToView
        // all columns by default have student info, set up 1 postion in array
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
        // if the report is for one person
        if (props.type === 'single') {
            // if quizIdToView is empty, we don't need to find data
            if (quizIdToView === '') { } else {
                // setup table data array
                let tableData = []
                // path reference to user object (need most updated data)
                let pathRef = ref(db, `/schools/hvhs/users/${id}/`);
                // path reference to quiz object (need most updated data)
                let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
                // get quizReference first
                onValue(quizRef, (snapshot) => {
                    // if data does not exist, we need to error handle
                    if (snapshot.val() === null || snapshot.val() === undefined) {
                    } else {
                        // set the current number of questions to firebase
                        setQuestNum(snapshot.val().numofquestions)
                        // for each question that exists
                        for (var index = 0; index < numOfQuest; index++) {
                            // push to the columns array
                            // e.g Header: 'Question 1', accessor "question1"
                            columns[1].columns.push({
                                Header: `Question ${index + 1}`,
                                accessor: `question${index + 1}`,
                            })
                        }
                    }
                })

                // on read of user object, get the data
                onValue(pathRef, (snapshot) => {
                    //  if data does not exist, we need to error handle
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        // set up the users information
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        // if there progress matches the number of questions for the current quiz, they have completed it
                        if (snapshot.val().quizzes.active[currentQuiz].progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                            dataForUser.completed = 'complete'
                        } else {
                            // they have not completed it
                            dataForUser.completed = 'incomplete'
                        }
                        // if it only exists in their turned in directory

                        if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                            // set a reference to prevent me from writng it out all the time
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            // for each question
                            for (var index = 0; index < quizReference.length; index++) {
                                // if it doesn't exist, skip!
                                if (quizReference[index] === undefined) {

                                } else {
                                    // set up status for table
                                    // i.e dataForUser.question1 = 'correct'
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            // finished here, push to table
                            tableData.push(dataForUser)
                        } else {
                            // if it exists in the active directory
                            let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                            // for each question
                            for (var index = 0; index < quizReference.length; index++) {
                                // if it doesn't exist, skip!
                                if (quizReference[index] === undefined) {

                                } else {
                                    // set up status for table
                                    // i.e dataForUser.question1 = 'correct'
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            // finished here, push to table
                            tableData.push(dataForUser)
                        }
                    }
                })
                // return components for reporting
                return (
                    // paper for styling and nice looks
                    <Paper elevation={3} className="paper-fix">
                        {/* Export buttons */}
                        <button onClick={() => generatePDF()}>Export to PDF</button>
                        <button onClick={() => generateExcel()}>Export to Excel</button>
                        {/* Table for viewing */}
                        <GenerateTable columns={columns} data={tableData} />
                        {/* Table for behind the scenes */}
                        <GeneratePDFTable columns={columns} data={tableData} />
                    </Paper>
                )
            }

            // if the report is for all students
        } else if (props.type === 'class') {
            // set up table data
            let tableData = []
            // student array contains all user ids to view
            let studentArray = props.students
            // setup path to quiz object
            let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
            // get quizReference first (always need most updated data)
            onValue(quizRef, (snapshot) => {
                // if data does not exist, we need to error handle
                if (snapshot.val() === null || snapshot.val() === undefined) {
                } else {
                    // set the current number of questions from quiz
                    setQuestNum(snapshot.val().numofquestions)
                    // for each question that exists
                    for (var index = 0; index < numOfQuest; index++) {
                        // push to the columns array
                        // e.g Header: 'Question 1', accessor "question1"
                        columns[1].columns.push({
                            Header: `Question ${index + 1}`,
                            accessor: `question${index + 1}`,
                        })
                    }
                }
            })
            // for each student
            for (var index = 0; index < studentArray.length; index++) {
                // set up path to that students object
                let pathRef = ref(db, `/schools/hvhs/users/${studentArray[index]}/`);
                // on read of user object, get the data (need most updated data)
                onValue(pathRef, (snapshot) => {
                    // if data does not exist, we need to error handle
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        // set up the users information
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        // if there progress matches the number of questions for the current quiz, they have completed it
                        if (snapshot.val().quizzes.active[currentQuiz].progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                            dataForUser.completed = 'complete'
                        } else {
                            // they have not completed it
                            dataForUser.completed = 'incomplete'
                        }
                        // if it only exists in their turned in directory
                        if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                            // set a reference to prevent me from writng it out all the time
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            // for each question
                            for (var index = 0; index < quizReference.length; index++) {
                                // if it doesn't exist, skip!
                                if (quizReference[index] === undefined) {

                                } else {
                                    // set up status for table
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            // finished here, push to table
                            tableData.push(dataForUser)
                        } else {
                            // if it exists in the active directory
                            let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                            // if the quiz reference is undefined, skip
                            if (quizReference === undefined) { } else {
                                // for each question
                                for (var index = 0; index < quizReference.length; index++) {
                                    // if it doesn't exist, skip!
                                    if (quizReference[index] === undefined) {

                                    } else {
                                        // set up status for table
                                        dataForUser['question' + index] = quizReference[index].status

                                    }
                                }
                            }
                            // finished here, push to table
                            tableData.push(dataForUser)
                        }
                    }
                })
            }
            // return components for reporting
            return (
                // paper for styling and nice looks
                <Paper elevation={3} className="paper-fix">
                    {/* Export buttons */}
                    <button onClick={() => generatePDF()}>Generate PDF</button>
                    <button onClick={() => generateExcel()}>Generate Excel</button>
                    {/* Table for viewing */}
                    <GenerateTable columns={columns} data={tableData} />
                    {/* Table for behind the scenes */}
                    <GeneratePDFTable columns={columns} data={tableData} />

                </Paper>
            )
        }
    }


    /**==============================================
     **              generatePDF
     *?  What does it do? Generates a PDF for exporting
     *@return File Download
     *=============================================**/
    function generatePDF() {
        // if the number of questions is greater than
        if (numOfQuest > 10) {
            // create a new document with landscape orentation
            const doc = new jsPDF({
                orientation: 'landscape',
            })
            // get the table data from the hidden table
            autoTable(doc, { html: '#reportTableToExport' })
            // set header
            // i.e QuizPoint | Report generated for QUIZ_ABCWEDF (will be fixed soon)
            doc.text(`QuizPoint | Report generated for ${quizIdToView} `, 10, 10);
            // set footer
            doc.setFontSize(9);
            // i.e Quiz Point | Generated by Max Webb
            doc.text(`QuizPoint | Generated by ${user.name}`, 10, 280);
            // set file name upon download
            // i.e 10PTEC report for QUIZ_ABCWEDF -  Generated by Max Webb
            let documentName = `${classObject.className} report for ${quizIdToView} - Generated ${today} `
            // perform save request
            doc.save(documentName + '.pdf')
        } else {
            // create a new document with portait orentation
            const doc = new jsPDF()
            // get the table data from the hidden table
            autoTable(doc, { html: '#reportTableToExport' })
            // set header
            // i.e QuizPoint | Report generated for QUIZ_ABCWEDF (will be fixed soon)
            doc.text(`QuizPoint | Report generated for ${quizIdToView} `, 10, 10);
            // set footer

            doc.setFontSize(9);
            // i.e Quiz Point | Generated by Max Webb
            doc.text(`QuizPoint | Generated by ${user.name}`, 10, 280);
            // set file name upon download
            // i.e 10PTEC report for QUIZ_ABCWEDF -  Generated by Max Webb
            let documentName = `${classObject.className} report for ${quizIdToView} - Generated ${today} `
            // perform save request
            doc.save(documentName + '.pdf')
        }
    }

    /**==============================================
     **              generateExcel()
     *?  What does it do? Generates an xlsx sheet for exporting
     *@return File Download
     *=============================================**/
    function generateExcel() {
        // set the spreadsheet name
        // i.e 10PTEC_report_QUIZ_ABCWEDF_19-05-2022
        let spreadsheet = `${classObject.className}_report_${quizIdToView}_${today} `
        // create a new workbook and file
        TableToExcel.convert(document.getElementById("reportTableToExport"), {
            // name of the file + file type
            name: spreadsheet + ".xlsx",
            // sheet name
            sheet: {
                name: "Sheet 1"
            }
        });
        // it will then download the file
    }
    // if loading
    if (loading) {
        return (
            // loading banner
            <div className="loading">
                {/* black backdrop */}
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    {/* cool hash loader */}
                    <HashLoader color={color} loading={loading} size={70} />

                </Backdrop>
            </div>
        )
    } else {
        // return page!
        return (
            <div className='student-report'>
                {/* Student Information First */}
                <div className="student-report-studentinfo">
                    {/* Generic Banner (needs to be exported later) */}
                    <div className="banner-details">
                        {/* Banner 1 - Details */}
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon>Class Details</h5>
                    </div>
                    <div className="user-content">
                        <div className="user-content-right">
                            {/* Basic Student information */}
                            <p><b>Class Name</b>: {classObject.className}</p>
                            <p><b>Class Teacher</b>: {classObject.classCreator}</p>
                            {/* when you click on link, it will send email */}
                        </div>
                    </div>
                </div>
                {/* Report Container */}
                <div className='student-report-container'>
                    {/* Input Box for selecting a quiz to view */}
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
                {/* report table container */}
                <div className='student-report-table'>
                    {/* report table component */}
                    <ReportTable type={'class'} students={studentInClass}></ReportTable>
                </div>
            </div>
        )
    }
}