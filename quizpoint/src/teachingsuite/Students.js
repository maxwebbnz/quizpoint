/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import './Students.css'
import React, { useState, useEffect } from 'react'
import { dbFunctions, db } from '../services/firebase'
import { ref, onValue, update, get } from "firebase/database";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


let allStudents = []

export default function Students() {
    const [loading, dataFetch] = useState(false)
    console.log(loading)

    useEffect(() => {
        if (loading === true) {
            document.title = ' loaded'
            console.log('loaded')
        } else {
            document.title = 'Loading Students'
            console.log('Loading')
            // dbFunctions.read('users').then(data => {
            //     if (data === undefined) {
            //         console.log(data)
            //     } else {
            //         console.log("loading into array")
            //         // console.log(data)
            //         Object.keys(data).forEach(function (key) {
            //             console.log(data[key])
            //             allStudents.push(data[key])
            //         });
            //         dataFetch(true)
            //         console.log(allStudents)
            //     }
            // })
            // read data
            function loadData() {
                console.log('loading user data')
                const pathRef = ref(db, `/schools/hvhs/users/`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    if (snapshot === undefined) {
                        console.log('no data')
                    } else {
                        const data = snapshot.val()
                        console.log(data)
                        Object.keys(data).forEach(function (key) {
                            console.log(data[key])
                            allStudents.push(data[key])
                        });
                        dataFetch(true)
                    }
                })
            }
            loadData()

        }
    })
    if (loading === false) {
        return (
            <div>
                <h1>Fetching Data</h1>
            </div>
        )
    } else {
        const listItems = allStudents.map((student) =>
            // console.log(student.name),
            <li> {student.name}</li>
        );
        return (

            <div clasName='studentPage'>
                <button onClick={() => dataFetch(false)} className='reload-button'>
                    <i className="bi bi-arrow-clockwise"></i> Reload Data
                </button>
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

