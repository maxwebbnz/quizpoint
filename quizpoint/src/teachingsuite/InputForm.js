/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**======================
 **   React Imports
 *========================**/
import React, { useState } from 'react'

/**======================
 **   Data service Imports
 *========================**/
import { user } from '../firebase/fb.user'
import axios from 'axios'
import { set } from "firebase/database";
import { db } from '../services/firebase'
import { ref as dbRef } from "firebase/database";
/**======================
 **   Material UI Imports
 *========================**/
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
/**======================
 **   MISC UI Imports
 *========================**/
import Swal from 'sweetalert2';
import step1 from './media/step1-importquiz.jpeg.png'
import step2 from './media/step2-importquiz.jpeg.png'
import { alert } from '../services/Alert';
import './InputForm.css'


import { useNavigate } from 'react-router-dom'
/**========================================================================
 **                           InputGoogleForm
 *?  What does it do? Handles inputting of google form (ui and data)
 *========================================================================**/
export default function InputGoogleForm() {
    const navigate = useNavigate()
    // states
    // determine if dialog open?
    const [openDialog, setOpenDialog] = useState(false)
    // form id, should be open?
    const [formId, setFormId] = useState('')
    // window title
    document.title = 'Import Form | QuizPoint'

    /**==============================================
     **              loadData
     *?  What does it do? Gets data from google form, and builds quizpoint data
     *=============================================**/
    function loadData() {
        // dont start if null
        if (formId === '') {

        } else {
            // reference from legacy code
            let fileId = formId
            // if for some reason we don't have token, this won't work.
            if (sessionStorage.authToken === undefined) {
                console.log("No auth token")
            }
            // send a get request to google form API to pull data for a form with the id of formID
            axios({
                method: 'get',
                url: 'https://forms.googleapis.com/v1/forms/' + fileId + '?access_token=' + sessionStorage.authToken,
                responseType: 'json'
            })
                // on response
                .then(function (response) {
                    // create a new quiz object to use
                    let newQuizObject = {
                        title: response.data.info.title,
                        numofquestions: response.data.items.length,
                        questions: []
                    }

                    // quicker way of writing it
                    let questions = response.data.items

                    // for each question in that form
                    for (var i = 0; i < questions.length; i++) {
                        // if it is an image upload question, we won't have options for it
                        if (questions[i].questionItem.question.fileUploadQuestion !== undefined) {
                            let newQuestionObject = {
                                name: questions[i].title,
                                inputtype: 'imageupload',
                                answer: 'imageupload',
                                choices: []
                            }
                            // if there is media in the question, add a reference to the drive link
                            if (questions[i].questionItem.image !== undefined) {
                                newQuestionObject.image = questions[i].questionItem.image.contentUri
                            }
                            // push the question
                            newQuizObject.questions.push(newQuestionObject)

                            // else if it is an multichoice
                        } else {
                            // create a new question object
                            let newQuestionObject = {
                                name: questions[i].title,
                                inputtype: 'multichoice',
                                answer: questions[i].questionItem.question.grading.correctAnswers.answers,
                                choices: []
                            }

                            if (questions[i].questionItem.image !== undefined) {
                                newQuestionObject.image = questions[i].questionItem.image.contentUri
                            }
                            // for each choices (with j => i), create a reference
                            for (var j = 0; j < questions[i].questionItem.question.choiceQuestion.options.length; j++) {
                                newQuestionObject.choices.push(questions[i].questionItem.question.choiceQuestion.options[j].value)
                            }
                            // push the question
                            newQuizObject.questions.push(newQuestionObject)
                        }

                    }

                    console.log("Created a new quiz from import ", newQuizObject)
                    // store in database
                    set(dbRef(db, 'schools/hvhs/quizzes/' + fileId), newQuizObject);
                    // close dialog, feedback

                    setOpenDialog(false)
                    alert.success("Imported Quiz Successfully", "Your Quiz has been saved and imported")
                    // catch an error
                }).catch(function (error) {
                    // if there is an error
                    if (error.response) {
                        // close the dialog
                        setOpenDialog(false)
                        // request made, but response contained error

                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        // 401 is an authentication error (commonly auth token)
                        if (error.response.status === 401) {
                            // error handle
                            Swal.fire({
                                icon: 'error',
                                title: 'Error ' + error.response.status,
                                text: 'You need to re-authenticate',
                                confirmButtonText: 'Okay',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // we will perform a quick little unauthentication trick

                                    navigate('/tcs/globalreauth/quizzes,import')
                                    // and then redirect the user to the login page (while maintaing the route)
                                    // should be sweet
                                } else if (result.isDenied) {
                                }
                            })
                            // if its another error, just show the error
                        } else {
                            alert.error(error.response.status, "There was an error importing your quiz, please try again later")
                        }

                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                })
        }
    }

    /**======================
     **   updateFormID
     *? What does it do? Updates the form id
     *@param e event
     *========================**/
    function updateFormID(e) {
        console.log(e.target.value)
        setFormId(e.target.value)
    }

    // return JSX
    return (
        <div className='inputform-feature'>
            <div className='inputform-feature-title'>
                <h5>Migrating from Google Forms?</h5>
                <h1>We have made it simple.</h1>
                <h5>You can now create quizzes from Google Forms without having to edit anything.</h5>
            </div>
            <div className='inputform-feature-steps'>
                <div className='1'>
                    <h6><strong>Step 1</strong></h6>
                    <img alt={'Step 1'} width='700' src={step1}></img>
                    <p>Copy Google Form ID from URL</p>
                </div>

                <div>
                    <h6><strong>Step 2</strong></h6>
                    <img alt={'Step 2'} width='700' src={step2}></img>
                    <p>Copy that ID into dialog</p>
                </div>


            </div>
            <div className="inputform-feature-action">
                <button className='generic-button sml' onClick={() => setOpenDialog(true)}>Import Form</button>
            </div>
            <Dialog
                open={openDialog}
                keepMounted
                onClose={() => setOpenDialog(false)}
                aria-describedby="alert-dialog-slide-description"
                maxWidth={'md'}
                fullWidth={true}
            >
                <DialogTitle>Enter Form ID </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <FormControl fullWidth>
                            {/* error if it state is = empty string */}
                            <TextField id="outlined-basic" onChange={updateFormID} label="Google Form ID" error={formId === ""}
                                helperText={formId === "" ? 'Please enter an ID' : ' '} variant="outlined" />

                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className='generic-button' onClick={() => loadData()}>Import Quiz</button>
                </DialogActions>
            </Dialog>
        </div >
    )
}