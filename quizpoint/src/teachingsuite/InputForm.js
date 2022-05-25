/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**======================
 **   React Imports
 *========================**/
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

/**======================
 **   Data service Imports
 *========================**/
import { user } from '../firebase/fb.user'
import axios from 'axios'
import { ref, set, update } from "firebase/database";
import { db } from '../services/firebase'


export default function InputGoogleForm() {
    const [loading, setLoading] = useState(true)
    // const []
    useEffect(() => {
        if (loading) {
            document.title = 'Loading Page'
        }
    }, [loading])

    function loadData() {
        var xhr = new XMLHttpRequest();
        let fileId = '1B8bMXALTANhGNvPA1T1UrC10pi26DnkWAjiO7cXZd5s'
        // we want a object back please
        xhr.responseType = 'json';
        if (sessionStorage.authToken === undefined) {
            console.log("No auth token")
            setLoading(false)
        }
        // send a get request to classroom.googleapis.com API
        xhr.open('GET',
            'https://forms.googleapis.com/v1/forms/' + fileId + '?access_token=' + sessionStorage.authToken);
        // on load

        xhr.onreadystatechange = function (e) {

        }
        console.log(xhr.response)



        let quizTitle = xhr.response.info.title
        let quizDescription = xhr.response.info.description

        console.log(quizTitle, quizDescription)
        if (xhr.response === null) {

        } else {
            let newQuizObject = {
                title: xhr.response.info.title,
                description: xhr.response.info.descriptions,
                numOfQuestions: xhr.response.items.length,
                questions: []
            }
            let questions = xhr.response.items
            for (var i = 0; i < questions.length; i++) {
                let newQuestionObject = {
                    title: questions[i].title,
                    inputtype: 'multichoice',
                    answer: questions[i].questionItem.question.grading.correctAnswers.answers,
                    choices: []
                }
                for (var j = 0; j < questions[i].questionItem.question.choiceQuestion.option.length; j++) {
                    newQuestionObject.choices.push(questions[i].questionItem.question.choiceQuestion.option.value)
                }

                console.log(newQuestionObject)
            }
        }
        xhr.send(null)
    }
    return (
        <div>
            <h1>Input Google Form</h1>
            <p>This is the input form for the Google Form</p>
            <button onClick={() => loadData()}>Get drive</button>
        </div>
    )
}