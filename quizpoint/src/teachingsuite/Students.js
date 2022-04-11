/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// styling
import './Students.css'
// react hooks
import React, { useState, useEffect } from 'react'
// database
import { db } from '../services/firebase'
// components from libs
import { ref, onValue, update, get } from "firebase/database";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// array placeholder
let allStudents = []

/**==============================================
 **              Students
 *?  What does it do? Component for handling student list on teaching suite
 *@return type
 *=============================================**/
export default function Students() {
    // state holder data fetching
    const [loading, dataFetch] = useState(false)

    console.log('Students() | Loading Data')
    /**======================
     **   useEffect
     *? Hook from react.js
     *========================**/
    useEffect(() => {
        // LOADING DATA, FETCHING FROM DB.
        if (loading === true) {
            document.title = ' Students | QuizPoint'
            console.log('Loading')

            // Currently fetching data
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
                const pathRef = ref(db, `/schools/hvhs/users/`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot === undefined) {
                        console.log('ERROR - NO DATA FOUND')

                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        // for each student value

                        Object.keys(data).forEach(function (key) {
                            // console.log(data[key])
                            // push to placeholder array
                            allStudents.push(data[key])
                        });
                        // finished loading, we can show page now
                        dataFetch(true)
                    }
                })
            }
            // trigger function
            loadData()

        }
    })
    // if loading
    if (loading === false) {
        // feed that back to user
        return (
            <div>
                <h1>Fetching Data</h1>
            </div>
        )
    } else {
        //? here for testing
        const listItems = allStudents.map((student) =>
            // console.log(student.name),
            <li> {student.name}</li>
        );
        // return HTML component
        return (
            // StudentPage data
            <div clasName='studentPage'>
                {/* reload data on click */}
                <button onClick={() => dataFetch(false)} className='reload-button'>
                    <i className="bi bi-arrow-clockwise"></i> Reload Data
                </button>
                {/* Material UI Table */}
                <div className='student-list'>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Student Name</TableCell>
                                    <TableCell align='right'>Student ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* for each student in allStudents array, create a row! */}
                                {allStudents.map((row) => (
                                    <TableRow
                                        key={row.uid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.studentID}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}

