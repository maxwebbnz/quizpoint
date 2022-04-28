/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import React, { useState, useEffect } from 'react'
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
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function Reporting() {
    const [allStudents, studentArray] = useState([])
    const [loadedData, setLoadingStatus] = useState(false)
    const [dialogContext, setContext] = useState()
    const [selectedStudent, selectStudent] = useState('')
    const shouldFade = true
    const [open, setOpen] = useState(false)
    // let className
    function dialogForClass() {
        setContext(
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Select a class</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <DialogContentText>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={console.log(selectedStudent)}>Load Report</Button>
                </DialogActions>
            </Dialog>

        )
        setOpen(true)
    }
    function dialogForStudent() {
        setContext(
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Select a student</DialogTitle>
                <DialogContent>
                    <DialogContentText>
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
                                        onChange={updateStudentName}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                            />

                        </Stack>
                    </DialogContentText>
                    <DialogContentText>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={console.log(selectedStudent)}>Load Report</Button>
                </DialogActions>
            </Dialog>

        )
        setOpen(true)
    }

    function updateStudentName(e) {
        selectStudent(e.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (!loadedData) {
            document.title = 'Loading Data | QuizPoint'
            // first we need to pull all students

            let pathRef = ref(db, `/schools/hvhs/users/`);
            onValue(pathRef, (snapshot) => {
                if (snapshot === undefined || snapshot === null) {
                    console.log("invalid class code")
                } else {
                    snapshot.forEach(childSnapshot => {
                        console.log(childSnapshot.val())
                        allStudents.push(childSnapshot.val())
                    })
                    console.log(allStudents)
                    setLoadingStatus(true)
                }
            })
        } else {
            document.title = 'Reporting | QuizPoint'

        }
    })
    if (!loadedData) {
        return (
            <div className="loading-container">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    } else {
        return (
            <div className='reporting'>
                <div className='reporting-header'>
                    <h1>Markbook and Reporting</h1>
                </div>
                <div className='reporting-body'>
                    <h2>To start, what would you like to view?</h2>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button onClick={dialogForClass}><SchoolOutlinedIcon></SchoolOutlinedIcon> Class Progress</Button>
                        <Button onClick={dialogForStudent}><PersonOutlineOutlinedIcon></PersonOutlineOutlinedIcon> Individual Student Progress</Button>
                        <Button><QuizOutlinedIcon></QuizOutlinedIcon> Quiz Progress</Button>
                    </ButtonGroup>
                </div>
                {dialogContext}
            </div>
        )
    }
}

