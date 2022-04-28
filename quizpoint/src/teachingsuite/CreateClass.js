/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// Styles and user import
import { user } from '../firebase/fb.user'
import './CreateClass.css'

// React and Firebase loads
import { useParams, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'

// database
import { db } from '../services/firebase'
import { ref, onValue, child, get, set, update } from "firebase/database";

// Material UI for components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Alert handling
import { alert } from '../services/Alert'

export default function CreateClass() {
    let { id } = useParams()
    const navigate = useNavigate();


    window.onbeforeunload = function () {
        return "You are currently creating a class, reloading will loose all of your progress.";
    }
    // set states for use in effect hook

    const [loadingData, setLoadingStatus] = useState(false)
    const [shouldFade, setFade] = useState(true)

    // text field states
    const [className, setClassName] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classObject, setClassObject] = useState({})
    const [open, setOpen] = useState(false)
    // let className

    const handleClose = () => {
        navigate('/class/' + id);

        setOpen(false);
    };
    function updateClassName(e) {
        console.log(e.target.value)
        setClassName(e.target.value)
        classObject.className = e.target.value
        console.log(classObject)

    }
    function updateClassDesc(e) {
        console.log(e.target.value)
        setClassDesc(e.target.value)
        classObject.classDesc = e.target.value
        console.log(classObject)

    }
    const Input = styled('input')({
        display: 'none',
    });

    function createClass() {
        console.log("Creating Class")
        // store object in firebase
        classObject.code = id
        classObject.classCreator = user.name
        classObject.quizzes = false
        set(ref(db, 'schools/hvhs/classes/' + id), classObject);
        // then add class to teachers classes
        update(ref(db, 'schools/hvhs/users/' + user.uid + '/classes/' + id), {
            code: id
        });
        console.log('Created!')
        setOpen(true)
    }

    return (
        <div className="createClass">
            <div className="createClass-header">
                <h1>Create a class</h1>
            </div>
            <div className="createClass-container">
                <h4>Basic Information</h4>
                <TextField
                    required
                    id="class-name"
                    label="Class Name"
                    onChange={updateClassName} //whenever the text field change, you save the value in state
                />
                <TextField
                    id="class-desc"
                    label="Class Description"
                    onChange={updateClassDesc} //whenever the text field change, you save the value in state
                />
                <hr></hr>
                <h4>Import Students</h4>
                <p>At this time, we will generate a code and link for you to share out!</p>
                {/* I reckon it would be cool to use the Google Classroom api */}
                {/* <label htmlFor="contained-button-file">
                    <Input accept="csv/*" id="contained-button-file" multiple type="file" />
                    <Button variant="contained" component="span">
                        CSV Student List
                    </Button>
                </label> */}


                <button onClick={createClass}>Create Class</button>

            </div>
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}

                open={open}
                onClose={handleClose}

            >
                <DialogTitle>Your class has been created</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        We have created {classObject.name} for you.

                        You can tell your students to join with the code:
                    </DialogContentText>
                    <h2>{id}</h2>
                    <DialogContentText>
                        or you can share out the link
                    </DialogContentText>
                    <h2><a href={'localhost:3000/invite/' + id} alt="Join Link">localhost:3000/invite/{id}</a></h2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Class Page</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}