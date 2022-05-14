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
    //use effect hook, no reference
    const [age, setAge] = useState('');
    const [quizToSelect, setSelect] = useState([])
    const handleChange = (event) => {
        setAge(event.target.value);
        console.log(event.target.value)
    };

    useEffect(() => {
        if (loading) {
            document.title = 'Loading Data | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/users/${id}`);

            onValue(pathRef, (snapshot) => {
                console.log(snapshot.val())
                let quizReference = snapshot.val().quizzes.active
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

        return (
            <div className='student-report'>
                <div className='student-report-container'>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Quiz</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                label="Quiz"
                                onChange={handleChange}
                            >
                                {quizToSelect}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className='student-report-table'>

                </div>
            </div>
        )
    }
}