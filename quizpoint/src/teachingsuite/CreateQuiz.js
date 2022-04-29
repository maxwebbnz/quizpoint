/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**========================================================================
 * ?  Will add comments shortly @maxwebbnz
 *========================================================================**/
// Styles and user import
import { user } from '../firebase/fb.user'
import './CreateQuiz.css'
import { uploadImage } from '../services/storage'
// React and Firebase loads
import { useParams, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'

// database
import { db } from '../services/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onValue, child, get, set, update } from "firebase/database";
import { ref as dbRef } from "firebase/database";

// material ui
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactTagInput from "@pathofdev/react-tag-input";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';

import "@pathofdev/react-tag-input/build/index.css";
const Input = styled('input')({
    display: 'none',
});
export default function CreateQuiz() {
    let { id } = useParams()
    const navigate = useNavigate();
    let tableData = [{
        name: "",
        type: "multichoice",
        choices: [""],
        image: '',
        uploadState: false
    }]


    const [tableRows, addTableRow] = useState(tableData)
    const [quizName, setQuizName] = useState("")
    const [quizDesc, setQuizDesc] = useState("")
    const [loadingData, setLoadingStatus] = useState(false)
    const [shouldFade, setFade] = useState(true)
    const [currentQuestion, setCurrentQuestionNum] = useState(1)
    const [tags, setTags] = React.useState([])
    const [uploadState, setUploadState] = useState('Upload Image')
    const [options, updateOptions] = useState()
    // window.onbeforeunload = function () {
    //     return "You are currently creating a class, reloading will loose all of your progress.";
    // }


    function updateCurrentQuestionName(e) {
        console.log(e.target.value)
        tableRows[currentQuestion - 1].name = e.target.value
        console.log(tableRows)
    }
    function updateCurrentQuestionType(e) {
        console.log(e.target.value)
        tableRows[currentQuestion - 1].type = e.target.value
        console.log(tableRows)
    }
    function updateCurrentQuestionAnswer(e) {
        console.log(e.target.value)
        tableRows[currentQuestion - 1].answer = e.target.value
        console.log(tableRows)
    }

    function updateQuizName(e) {
        setQuizName(e.target.value)
        console.log(quizName)

    }

    function updateQuizDesc(e) {
        setQuizDesc(e.target.value)
        console.log(quizDesc)

    }
    function handleChange(e) {
        console.log(e.target.value)

        tableRows[currentQuestion - 1].image = e.target.value
        tableRows[currentQuestion - 1].uploadState = true
        // console.log(this.state.image);
        let file = e.target.files[0]
        let returnURL
        const storage = getStorage();
        const storageRef = ref(storage, "QUIZPOINT_QUIZ_IMAGES_" + id + currentQuestion);
        const metadata = {
            contentType: 'image/jpeg',
        };

        //? code from firebase examples
        // 'file' comes from the Blob or File API
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    tableRows[currentQuestion - 1].image = downloadURL
                });
            }
        );

    }
    function updateCurrentQuestionOptions(items) {
        for (var index = 0; index < items.length; index++) {
            if (items[index] === "") {
                items.splice(index, 1)
            }
        }

        console.log(items)
        tableRows[currentQuestion - 1].choices = items
        let optionSelect = items.map((item, index) => {
            return (
                <MenuItem value={item}>{item}</MenuItem>
            )
        })
        updateOptions(optionSelect)
        setTags(items)
    }
    function addRow() {
        addTableRow([...tableRows, {
            name: "",
            type: "multichoice",
            choices: [""],
            image: ''
        }])
        setCurrentQuestionNum(currentQuestion + 1)
    }

    function saveQuizToDb() {
        let quizObject = {
            title: quizName,
            description: quizDesc,
            questions: tableRows
        }
        console.log(quizName)

        set(dbRef(db, 'schools/hvhs/quizzes/' + id), {
            title: quizName,
            description: quizDesc,
            questions: tableRows

        });

        console.log("Saved Quiz Successfully", quizObject)
    }
    const tableRow = tableRows.map((row, index) => {
        return (
            <Fade in={shouldFade}>
                <tr>
                    <td>{index + 1}</td>

                    <td>
                        <TextField
                            id="outlined-required"
                            margin="dense"
                            label="Question Name"
                            placeholder={row.name}
                            onChange={updateCurrentQuestionName}
                        />
                    </td>
                    <td>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleChange} />
                            <Button variant="contained" component="span">
                                Upload Image                        </Button>
                        </label>
                    </td>
                    <td>
                        <FormControl fullWidth>
                            <Select
                                margin="dense"
                                labelId="answer-type"
                                id="answer-type"
                                label="Type"
                                defaultValue=""
                                onSelect={updateCurrentQuestionType}
                            >
                                <MenuItem value='multichoice'>Multi Choice</MenuItem>
                                <MenuItem value='imageupload'>Image Upload</MenuItem>
                            </Select>
                        </FormControl>
                    </td>
                    <td>
                        <ReactTagInput
                            tags={row.choices}
                            onChange={(newTags) => updateCurrentQuestionOptions(newTags)}
                        />
                    </td>
                    <td>
                        <FormControl fullWidth>
                            <Select
                                margin="dense"
                                labelId="answer-type"
                                id="answer-type"
                                defaultValue=""
                                placeholder={row.answer}
                                label="Answer"
                                onChange={updateCurrentQuestionAnswer}
                            >
                                {options}
                                <MenuItem value={'multichoice'}>Select One</MenuItem>

                            </Select>
                        </FormControl>
                    </td>
                </tr>
            </Fade>
        )
    })

    return (
        <div className='createquiz-container'>
            <div className='createquiz-header'>
                <h2>Create a Quiz</h2>
            </div>
            <div className='createquiz-body'>
                <div className='createquiz-basicinfo'>
                    <h4>Basic Information</h4>
                    <TextField
                        required
                        id="outlined-required"
                        label="Quiz Title"
                        onChange={updateQuizName} //whenever the text field change, you save the value in state
                        margin="dense"
                    />
                    <TextField
                        id="outlined-required"
                        margin="dense"
                        label="Quiz Description"
                        onChange={updateQuizDesc} //whenever the text field change, you save the value in state
                    />
                </div>
                <div className='createquiz-questions'>
                    <button onClick={addRow}>New Question</button>
                    <table className='createquiz-table'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Upload Image</th>
                                <th>Question Type</th>
                                <th>Options</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRow}
                        </tbody>
                    </table>
                </div>
                <button onClick={saveQuizToDb}>Save Quiz</button>
            </div>
        </div>
    )
}