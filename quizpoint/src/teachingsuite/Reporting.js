/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
/**========================================================================
 * *                          Reporting Module
 *========================================================================**/

/**======================
 **   React Imports
 *========================**/
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"

/**======================
 **   Data Service Imports
 *========================**/
import { db } from '../services/firebase'
import { ref, onValue } from "firebase/database";
/**======================
 **   Material UI Imports
 *========================**/

import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import HashLoader from "react-spinners/HashLoader";
import FormControl from '@mui/material/FormControl';

/**======================
 **   Stylesheet Imports
 *========================**/
import './Reporting.css'
/**==============================================
 **              Reporting()
*?  What does it do? Hub for reporting, home page
*=============================================**/
export default function Reporting() {
    // bool placeholder
    const shouldFade = true
    // color for backdrop
    let [color] = useState("#ffffff");
    // states
    const [loadingData, isLoading] = useState(true)
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [studentOptions, setStudentOptions] = useState([])
    const [classOptions, setClassOptions] = useState([])
    const [studentOpen, setStudentOpen] = useState(false);
    const [classOpen, setClassOpen] = useState(false);
    const [selectedOption, setOption] = useState('')
    // navigate reference
    let navigate = useNavigate()


    // use effect hook
    useEffect(() => {
        // if data is loading
        if (loadingData) {
            /**======================
             **   Load Data
             *? What does it do? Loads data from firebase
             *========================**/
            function loadData() {
                // path reference
                const pathRef = ref(db, `/schools/hvhs/users/`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // for each user
                    snapshot.forEach(childSnapshot => {
                        // if user is a student
                        if (childSnapshot.val().role === "student") {
                            // add student to student array
                            setStudents(prevStudents => [...prevStudents, childSnapshot.val()])
                            // create an option
                            let newStudent = {
                                label: childSnapshot.val().name,
                                value: childSnapshot.key
                            }
                            // add option to student options
                            studentOptions.push(newStudent)
                        }

                    })
                    // then load classes
                    const pathRef2 = ref(db, `/schools/hvhs/classes/`);
                    // wait for data
                    onValue(pathRef2, (snapshot) => {
                        // for each class
                        snapshot.forEach(childSnapshot => {
                            // add class to class array
                            setClasses(prevClasses => [...prevClasses, childSnapshot.val()])
                            // create an option
                            let newClass = {
                                label: childSnapshot.val().className,
                                value: childSnapshot.key
                            }
                            // add option to class options
                            classOptions.push(newClass)
                        })
                    })
                })
            }
            // load data
            loadData()
            // set loading to false
            isLoading(false)

            // if data is not loading
        } else {
            // set title
            document.title = 'Reports | QuizPoint'

        }
    }, [loadingData, classes, students])


    /**==============================================
     **              studentDialog
     *?  What does it do? Opens a dialog for selecting a student
     *=============================================**/
    function studentDialog() {

        /**======================
         **   handleClose()
        *?  What does it do? Closes the dialog
         *========================**/
        const handleClose = () => {
            // close dialog
            setStudentOpen(false);
            // if field is empty
            if (selectedOption === '') {
                // set selected option to empty
                setStudentOpen(false);

                // else if not
            } else {
                // navigate to report page
                navigate('/tcs/reports/student/' + selectedOption)
            }
        };

        // return JSX dialog
        return (
            <Dialog
                open={studentOpen}
                onClose={handleClose}
                fullWidth={true}

                maxWidth={'lg'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Select a Student"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormControl fullWidth>
                            <Autocomplete
                                onChange={(event, newValue) => {
                                    setOption(newValue.value)
                                }}
                                getOptionLabel={option => option.label}
                                disablePortal
                                id="combo-box-demo"
                                options={studentOptions}
                                renderInput={(params) => <TextField {...params} label="Student" />}
                            />
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Select
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    /**==============================================
     *           classDialog
     * ?  What does it do? Opens a dialog for selecting a class
     * ==============================================**/
    function classDialog() {
        /**======================
         **   handleClose
        *?  What does it do? Closes the dialog
         *========================**/

        const handleClose = () => {
            // close dialog
            setClassOpen(false);
            // if field is empty
            if (selectedOption === '') {

                setClassOpen(false);
                // else if not
            } else {
                // navigate to report page
                navigate('/tcs/reports/class/' + selectedOption)
            }
        };

        // return JSX dialog
        return (
            <Dialog
                open={classOpen}
                onClose={handleClose}
                fullWidth={true}

                maxWidth={'lg'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Select a class"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormControl fullWidth>
                            <Autocomplete
                                onChange={(event, newValue) => {
                                    setOption(newValue.value)
                                }}
                                getOptionLabel={option => option.label}
                                disablePortal
                                id="combo-box-demo"
                                options={classOptions}
                                renderInput={(params) => <TextField {...params} label="Class" />}
                            />
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Select
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    // if data is loading
    if (loadingData) {
        return (
            <div className="loading-container">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <HashLoader color={color} loading={isLoading} size={70} />

                </Backdrop>
            </div>
        )

        // if data is not loading
    } else {
        return (
            <div className='reporting'>
                <h1>Select a reporting feature {loadingData}</h1>
                <div className="reporting-buttons">
                    <button className='generic-button sml' onClick={() => setStudentOpen(true)}>Student</button>
                    <button className='generic-button sml' onClick={() => setClassOpen(true)}>Class</button>
                </div>
                {studentDialog()}
                {classDialog()}
            </div >

        )
    }
}

