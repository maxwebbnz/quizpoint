/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"

// database
import { db } from '../services/firebase'

// components from libs
import { ref, onValue } from "firebase/database";
import './Reporting.css'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import Slide from '@mui/material/Slide';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import HashLoader from "react-spinners/HashLoader";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Reporting() {
    let { field } = useParams()
    const [loadingData, isLoading] = useState(true)
    let [color, setColor] = useState("#ffffff");
    const [options, setOptions] = useState([])
    const shouldFade = true
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedOption, setOption] = useState('')
    const [setOfOptions, setSetOfOptions] = useState([])
    let navigate = useNavigate()
    let selectedClassId
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        navigate('/tcs/reports/class/' + selectedClassId)
        setOpen(false);
    };

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });


    useEffect(() => {
        if (loadingData) {
            document.title = 'Loading... | QuizPoint'
            function loadAllClasses() {
                let pathRef = ref(db, `/schools/hvhs/classes/`);
                onValue(pathRef, (snapshot) => {
                    if (snapshot === undefined || snapshot === null) {
                        console.log("invalid class code")
                    } else {
                        snapshot.forEach(childSnapshot => {
                            if (childSnapshot.cache) {
                                return;
                            } else {
                                classes.push(childSnapshot.val())
                            }
                        })
                        console.log(classes)
                    }
                })
            }
            loadAllClasses()

            function loadAllStudents() {
                let pathRef = ref(db, `/schools/hvhs/users/`);
                onValue(pathRef, (snapshot) => {
                    if (snapshot === undefined || snapshot === null) {
                        console.log("invalid class code")
                    } else {
                        snapshot.forEach(childSnapshot => {
                            if (childSnapshot.cache) {
                                return;
                            } else {
                                if (childSnapshot.val().role !== "student") {
                                    console.log('not a student')
                                } else {
                                    // error prevention
                                    //! this code does not work as intended, sucks to be me!
                                    if (childSnapshot.val().average === undefined || childSnapshot.val().average === null) {
                                        childSnapshot.val().average = 0
                                        students.push(childSnapshot.val())
                                    } else {
                                        students.push(childSnapshot.val())

                                    }

                                }
                            }
                        })
                        isLoading(false)
                        console.log(students)
                    }
                })

            }
            loadAllStudents()
        } else {
            document.title = 'HELLO'
        }
    })


    function displaySelectionDialog(type) {
        let selectedArray;

        if (type === "class") {
            selectedArray = classes
            let placeholder = classes.map(classObj => {
                return (
                    <MenuItem key={classObj.code} value={classObj.code}>
                        {classObj.className}
                    </MenuItem>
                )
            })
            setSetOfOptions(placeholder)
        } else if (type === "student") {
            selectedArray.type = students
            setSetOfOptions(selectedArray)

        }


        setOption(type)

        // after options setting,
        setOpen(true);

    }

    function handleClassSelect(e) {
        console.log(e.target.value)
        selectedClassId = e.target.value
    }

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
    } else {
        return (
            <div>
                <h1>Select a reporting feature {loadingData}</h1>
                <div className="reporting-buttons">
                    <Button variant="contained" color="primary" onClick={() => displaySelectionDialog('class')}>View by class</Button>
                    <Button variant="contained" color="primary" onClick={() => console.log('clickedf')}>View by quiz</Button>
                    <Button variant="contained" color="primary" onClick={() => displaySelectionDialog('student')}>View by student</Button>
                </div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>Select a {selectedOption}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{selectedOption}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                    onChange={handleClassSelect}
                                >
                                    {setOfOptions}
                                </Select>
                            </FormControl>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Select</Button>
                    </DialogActions>
                </Dialog>
            </div >

        )
    }
}

