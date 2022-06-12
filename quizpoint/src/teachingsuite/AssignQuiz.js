/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import { useState, useEffect } from 'react'

// data services
import { db, dbFunctions } from '../services/firebase'
import { set, ref, onValue, update } from 'firebase/database'
// UI
import { alert } from '../services/Alert';
// MUI components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function AssignQuiz(props) {
    const [loading, setloading] = useState(true)
    const [allQuizzes, setQuizzes] = useState([])
    const [openDialog, setDialog] = useState(false)
    const [selectedQzId, setQzId] = useState('')
    console.log(props.classList)
    useEffect(() => {
        if (loading) {
            document.title = 'Loading Module | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/quizzes/`);
            onValue(pathRef, (snapshot) => {
                console.log(snapshot.val())
                snapshot.forEach(function (snapshot) {
                    console.log(snapshot.val())
                    if (snapshot.key === 'cache') { } else {
                        let newQuizObjectForSelect = {
                            label: snapshot.val().title,
                            value: snapshot.key
                        }
                        allQuizzes.push(newQuizObjectForSelect)
                    }
                })
                console.log(allQuizzes)
                setloading(false)
            })
        } else {

        }
    })

    function setQuizToAssign(_qzId) {
        let studentsArray = props.classList
        let classId = props.classId
        if (classId !== undefined) {
            console.log(classId)
            console.log(props.classList)
            for (var i = 0; i < studentsArray.length; i++) {
                let studentId = studentsArray[i]
                console.log(studentId)

                dbFunctions.write(`users/${studentId}/quizzes/active/${_qzId}`, {
                    details: {
                        code: _qzId,
                        name: allQuizzes.filter(qz => qz.value === _qzId)[0].label,
                        progress: 0
                    }
                })

            }
            dbFunctions.write(`classes/${classId}/quizzes/${_qzId}`, {
                code: _qzId,
                name: allQuizzes.filter(qz => qz.value === _qzId)[0].label,
            })
            setDialog(false)
            alert.success(`Assigned ${allQuizzes.filter(qz => qz.value === _qzId)[0].label} successfully`)
            window.location.reload()
        }



    }


    return (
        <>
            <Dialog
                open={openDialog}
                fullWidth={true}
                maxWidth={'md'}
                onClose={() => setDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Assign a quiz"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Select a quiz from below, and click assign.
                    </DialogContentText>
                    <Autocomplete
                        onChange={(event, newValue) => {
                            setQzId(newValue.value)
                        }}
                        getOptionLabel={option => option.label}
                        disablePortal
                        id="combo-box-demo"
                        options={allQuizzes}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Quiz" />}
                    />
                </DialogContent>
                <DialogActions>
                    <button className='generic-button' onClick={() => setQuizToAssign(selectedQzId)}>Assign</button>
                </DialogActions>
            </Dialog >
            <button className='generic-button sml' onClick={() => setDialog(true)}>Assign Quiz</button>
        </>
    )

}

