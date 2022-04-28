/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// Styles and user import
import { user } from '../firebase/fb.user'
import './CreateQuiz.css'

// React and Firebase loads
import { useParams, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'

// database
import { db } from '../services/firebase'
import { ref, onValue, child, get, set, update } from "firebase/database";

// material ui
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function CreateQuiz() {
    let { id } = useParams()
    const navigate = useNavigate();

    const [loadingData, setLoadingStatus] = useState(false)
    const [shouldFade, setFade] = useState(true)

    // window.onbeforeunload = function () {
    //     return "You are currently creating a class, reloading will loose all of your progress.";
    // }
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
                        margin="dense"
                    />
                    <TextField
                        id="outlined-required"
                        margin="dense"
                        label="Quiz Description"
                    />
                </div>
            </div>
        </div>
    )
}