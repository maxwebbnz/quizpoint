/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

// database
import { db } from '../services/firebase'
import ReactTagInput from "@pathofdev/react-tag-input";
// components from libs
import { onValue } from "firebase/database";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './EditQuiz.css'

// database
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { set } from "firebase/database";
import { ref as dbRef } from "firebase/database";
import Compressor from 'compressorjs';


export default function EditQuiz() {
    // reference to id in url
    let { id } = useParams()

    // state references
    const [loadingQuiz, setLoadingQuiz] = useState(true)
    const [loadedQuizToEdit, setQuizObject] = useState({})
    const [currentQuestionIndex, setQuestionIndex] = useState(0)
    const [options, updateOptions] = useState()
    const [currentQuestionAnswer, setCqAnswer] = useState('')
    const [currentQuestionTags, setCurrentTags] = useState([])
    const [currentImageDisplayed, setCurrentImage] = useState('')
    const [currentQuestionAnswerTags, setAnswerTags] = useState([])
    const [currentQuestionName, setCurrentQuestionName] = useState()

    //
    useEffect(() => {
        if (loadingQuiz) {
            document.title = 'Loading Quiz | QuizPoint'
            let pathRef = dbRef(db, `/schools/hvhs/quizzes/${id}`);
            onValue(pathRef, (snapshot) => {
                if (snapshot.val() === null || undefined) {
                    console.log('Quiz not exist')
                } else {
                    console.log(snapshot.val())
                    setQuizObject(snapshot.val())

                    setCurrentTags(snapshot.val().questions[currentQuestionIndex].choices)
                    let answerTagObject = []

                    if (snapshot.val().questions[currentQuestionIndex].inputtype === 'multichoice') {
                        if (snapshot.val().questions[currentQuestionIndex].answer !== undefined) {
                            for (var i = 0; i < snapshot.val().questions[currentQuestionIndex].answer.length; i++) {
                                answerTagObject.push(snapshot.val().questions[currentQuestionIndex].answer[i].value)
                            }
                            setAnswerTags(answerTagObject)
                        }

                        setCurrentImage(snapshot.val().questions[currentQuestionIndex].image)
                        setCurrentQuestionName(snapshot.val().questions[currentQuestionIndex].name)

                    } else {
                        // NOTHING SHOULD HAPPEN

                        setCurrentImage(snapshot.val().questions[currentQuestionIndex].image)
                        setCurrentQuestionName(snapshot.val().questions[currentQuestionIndex].name)

                    }

                    setLoadingQuiz(false)
                }
            })
            // load quiz data
        } else {
            document.title = 'Edit Quiz | QuizPoint'
        }
    }, [loadingQuiz])


    /**======================
     **   updateQuizName
     *@param e event target
     *========================**/
    function updateQuizName(e) {
        let quiz = loadedQuizToEdit
        quiz.title = e.target.value
        setQuizObject(quiz)
    }

    /**======================
     **   updateQuizDescription
     *@param e event target
     *========================**/
    function updateQuizDescription(e) {
        let quiz = loadedQuizToEdit
        quiz.description = e.target.value
        setQuizObject(quiz)
    }

    /**======================
     **   updateCurrentQuestionChoices
     *@param tag event target (array of tags)
     *========================**/
    function updateCurrentQuestionChoices(tag) {
        let quiz = loadedQuizToEdit
        quiz.questions[currentQuestionIndex].choices = tag
        setQuizObject(quiz)
        setCurrentTags(tag)
    }

    /**======================
     **   updateCurrentQuestionAnswer
     *@param tag event target (array of tags)
     *@param curPos length of array
     *========================**/
    function updateCurrentQuestionAnswer(tag, curPos) {
        let quiz = loadedQuizToEdit
        console.log(loadedQuizToEdit.questions[currentQuestionIndex])
        let currentLengthOfTags
        if (loadedQuizToEdit.questions[currentQuestionIndex].answer !== undefined) {
            currentLengthOfTags = loadedQuizToEdit.questions[currentQuestionIndex].answer.length + 1
        } else {
            currentLengthOfTags = 1
        }
        let newAnswers = []
        for (var i = 0; i < tag.length; i++) {
            newAnswers.push({ value: tag[i] })
        }
        quiz.questions[currentQuestionIndex].answer = newAnswers
        setQuizObject(quiz)
        setAnswerTags(tag)
    }

    /**======================
     **   nextQuestion
     *========================**/
    function nextQuestion() {
        if (currentQuestionIndex > loadedQuizToEdit.questions.length) {
            console.log('Quiz ended')
        } else {
            let newNum = currentQuestionIndex + 1
            setQuestionIndex(newNum)
            console.log(currentQuestionIndex, newNum)
            setCurrentTags(loadedQuizToEdit.questions[newNum].choices)

            console.log(loadedQuizToEdit.questions[newNum].choices)
            console.log(currentQuestionTags)
            let optionSelect = loadedQuizToEdit.questions[currentQuestionIndex].choices.map((item, index) => {
                return (
                    // JSX for each option
                    <MenuItem value={item}>{item}</MenuItem>
                )
            })
            setCurrentQuestionName(loadedQuizToEdit.questions[newNum].name)
            console.log(currentQuestionName)
            let answerTagObject = []
            for (var i = 0; i < loadedQuizToEdit.questions[newNum].answer.length; i++) {
                answerTagObject.push(loadedQuizToEdit.questions[newNum].answer[i].value)
            }
            setAnswerTags(answerTagObject)
            setCurrentImage(loadedQuizToEdit.questions[newNum].image)

            // set state for options
            updateOptions(optionSelect)
            // update answer
        }
    }

    /**======================
     **   backQuestion
     *========================**/
    function backQuestion() {
        let newNum = currentQuestionIndex - 1
        setQuestionIndex(newNum)
        console.log(currentQuestionIndex, newNum)
        setCurrentTags(loadedQuizToEdit.questions[newNum].choices)

        console.log(loadedQuizToEdit.questions[newNum].choices)
        console.log(currentQuestionTags)
        let optionSelect = loadedQuizToEdit.questions[currentQuestionIndex].choices.map((item, index) => {
            return (
                // JSX for each option
                <MenuItem value={item}>{item}</MenuItem>
            )
        })
        setCurrentQuestionName(loadedQuizToEdit.questions[newNum].name)
        console.log(currentQuestionName)

        let answerTagObject = []
        for (var i = 0; i < loadedQuizToEdit.questions[newNum].answer.length; i++) {
            answerTagObject.push(loadedQuizToEdit.questions[newNum].answer[i].value)
        }
        setAnswerTags(answerTagObject)
        setCurrentImage(loadedQuizToEdit.questions[newNum].image)
        // set state for options
        updateOptions(optionSelect)
        // update answer
    }


    /**======================
     **   updateQuestionMedia
     *@param e event target
     *========================**/
    function updateQuestionMedia(e) {
        let file = e.target.files[0]
        console.log(file)
        /**==============================================
        **              Compressor
        *?  What does it do? compresses quiz question media to 60% of quaility (40% decrease to save space)
        *=============================================**/
        new Compressor(file, {
            quality: 0.6,
            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            success(result) {
                console.log(result)
                // The third parameter is required for server
                // reference to firebase lib
                const storage = getStorage();
                // create reference to new image
                const storageRef = ref(storage, "QUIZPOINT_QUIZ_IMAGES_" + id + (currentQuestionIndex + 1));
                // metadata so image is uploaded properly
                const metadata = {
                    contentType: 'image/jpeg',
                };

                //? code from firebase examples
                // 'file' comes from the Blob or File API
                const uploadTask = uploadBytesResumable(storageRef, result, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');

                    },
                    (error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors

                    },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            // set image url to question
                            loadedQuizToEdit.questions[currentQuestionIndex].image = downloadURL
                            setCurrentImage(downloadURL)

                        });
                    }
                );
                // Send the compressed image file to server with XMLHttpRequest.

            },
            error(err) {
                console.log(err.message);
            },
        });
    }

    /**======================
     **   updateCurrentQuestionName
     *@param e event target
     *========================**/

    function updateCurrentQuestionName(e) {
        setCurrentQuestionName(e.target.value)
        let quiz = loadedQuizToEdit
        quiz.questions[currentQuestionIndex].name = e.target.value
        setQuizObject(quiz)

    }

    /**======================
     **   updateQuiz
     *========================**/
    function updateQuiz() {
        set(dbRef(db, "/schools/hvhs/quizzes/" + id), loadedQuizToEdit)
        console.log('Saved quiz object', loadedQuizToEdit)
    }

    if (loadingQuiz) {
        return (
            <h1>Loading Information</h1>
        )
    }
    else {
        function generateQuestionChoice() {
            if (loadedQuizToEdit.questions[currentQuestionIndex].inputtype === 'multichoice') {
                return (
                    <div className='question-multi'>
                        < p > <strong>Question Choices</strong></p>
                        <ReactTagInput
                            tags={currentQuestionTags}
                            onChange={(newTags) => updateCurrentQuestionChoices(newTags)}
                        />
                        <p><strong>Question Answer</strong></p>
                        <ReactTagInput
                            suggestions={currentQuestionTags}
                            tags={currentQuestionAnswerTags}
                            onChange={(newTags, curPos) => updateCurrentQuestionAnswer(newTags, curPos)}
                            autocomplete
                        />
                    </div>
                )
            } else {
                return (
                    <div>
                        <TextField
                            disabled
                            id="outlined-disabled"
                            label="Question Answer"
                            defaultValue="Question is upload based"
                        />
                    </div>


                )
            }
        }

        function questionEditer() {
            if (currentQuestionIndex > loadedQuizToEdit.questions.length - 1) {
                return (
                    <div className='editquiz-question'>
                        <hr></hr>

                        <p>You have reached the end of the quiz</p>
                        <button onClick={() => backQuestion()} className='generic-button sml'>Back question</button>
                        <button onClick={() => updateQuiz()} className='generic-button sml'>Save Quiz</button>

                    </div>
                )
            } else {
                return (
                    <div className="editquiz-question">
                        <h2>Edit Questions</h2>
                        <p><strong>Question {currentQuestionIndex + 1}</strong></p>
                        <TextField id="outlined-basic" value={currentQuestionName} onChange={updateCurrentQuestionName} variant="outlined" />
                        <p><strong>Question Media (click image to change)</strong></p>
                        <input onChange={updateQuestionMedia} type="file" id="img" style={{ display: "none" }} />
                        <label for="img">{generateQuestionMedia()}</label>
                        {generateQuestionChoice()}

                        <button onClick={() => backQuestion()} className='generic-button sml'>Back question</button>
                        <button onClick={() => nextQuestion()} className='generic-button sml'>Next question</button>


                    </div>
                )
            }
        }
        function generateQuestionMedia() {
            if (loadedQuizToEdit.questions[currentQuestionIndex].image === undefined) {
                return 'Upload Image'
            } else {
                return <img alt="Quiz Media" src={currentImageDisplayed} />
            }
        } let questionType
        if (currentQuestionIndex > loadedQuizToEdit.questions.length) {
            questionType = loadedQuizToEdit.questions[currentQuestionIndex].inputtype

        } else { }
        return (

            <div className='editquiz-container'>
                <div className='editquiz-headers'>
                    <div>
                        <h2>Quiz Name</h2>
                        <TextField id="quizname" label="Quiz Title" onChange={updateQuizName} defaultValue={loadedQuizToEdit.title} variant="outlined" />
                    </div>
                    <div>
                        <h2>Quiz Description </h2>
                        <TextField id="quizdesc" label="Quiz Description" onChange={updateQuizDescription} defaultValue={loadedQuizToEdit.description} variant="outlined" />

                    </div>
                    <button onClick={() => updateQuiz()} className='generic-button sml'>Save Quiz</button>
                </div>

                <>
                    {questionEditer()}

                </>
            </div >
        )
    }
}
