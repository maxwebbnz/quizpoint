/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 *
 */
// import statements
import { user } from '../firebase/fb.user.js';
import React from 'react'
// import { db, ref } from '../services/firebase.js';
import './ClassHome.css'
import { dbFunctions } from '../services/firebase.js';

let userClasses = []
let foundClasses = []

function getAllUserClasses() {
    for (const classId in user.classes) {
        userClasses.push(classId)
    }
    for (var i = 0; i < userClasses.length; i++) {
        dbFunctions.read(`/classes/${userClasses[i]}`).then(function (snapshot) {
            if (snapshot === null) {
                console.log('no class found')
            } else {
                foundClasses.push(snapshot)
            }
        })
    }
}

const ClassHome = () => {

    return (
        <div className="class-home">
            <div className="class-header">
                <h2>Welcome, {user.name}</h2>
            </div>
            <div className="class-body">
                <button onClick={dbFunctions.write('/testing/', {
                    test: 'test'
                })}>Test Write to path /testing/ with object of test with val of 'test'</button>
            </div>
        </div>

    )

}

export default ClassHome