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
import { ref, onValue } from "firebase/database";
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom"
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
// reactUI material
import { DataGrid } from '@mui/x-data-grid';
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// array placeholder
let allStudents = []

// header for the table
const columns = [
    { field: 'id', headerName: 'App UID', width: 100, hide: true },
    { field: 'firstName', headerName: 'Name', width: 400 },
    { field: 'studentID', headerName: 'Student ID', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
];

const rows = []

/**==============================================
 **              Students
 *?  What does it do? Component for handling student list on teaching suite
 *@return type
 *=============================================**/
export default function Students() {
    let { type } = useParams()
    // state holder data fetching
    const [loading, dataFetch] = useState(false)
    const [select, setSelection] = React.useState([]);
    const handleRowSelection = (e) => {
        // prints correct indexes of selected rows
        console.log("adding", e);
        // missing the first row selected
        setSelection(e);
        // console.log(select);
    };
    var shouldFade = true;
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
            if (type === 'all') {
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
                                rows.push({
                                    id: key,
                                    studentID: data[key].studentID,
                                    firstName: data[key].name,
                                    email: data[key].email,
                                })
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
        }
    })
    // if loading
    if (loading === false) {
        // feed that back to user
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    } else {
        //? here for testing
        // const listItems = allStudents.map((student) =>
        //     // console.log(student.name),
        //     <li> {student.name}</li>
        // );

        // return HTML component
        return (
            <Fade in={shouldFade}>
                <div clasName='studentPage'>
                    {/* reload data on click */}
                    <div className='actions'>
                        <h4 className='header'>Actions</h4>
                        <br></br>
                        <button onClick={() => window.location.reload(false)} className='reload-button'>
                            <i className="bi bi-arrow-clockwise"></i> Reload Data
                        </button>
                        <Stack spacing={2} sx={{ width: 300 }}>
                            <Autocomplete
                                freeSolo
                                id="searchStudentName"
                                disableClearable
                                options={allStudents.map((option) => option.name)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search for a student"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                            />

                        </Stack>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" onClick={() => window.location.replace('/tcs/user/' + select)}>View Selected Students</Button>
                        </Stack>
                    </div>

                    {/* Material UI Table */}
                    <div style={{ height: 600, width: '90%' }} className='dataTable'>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            onSelectionModelChange={handleRowSelection}

                        />
                    </div>
                </div>
            </Fade>
        )
    }
}

