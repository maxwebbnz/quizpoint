/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react'
import { dbFunctions, db } from '../services/firebase'
import { getDatabase, ref, onValue, update, get } from "firebase/database";

let allStudents = []

export default function Students() {
    const [loading, dataFetch] = useState(false)
    console.log(loading)
    useEffect(() => {
        if (loading === true) {
            document.title = ' loaded'
            console.log('loaded')
        } else {
            document.title = 'Loading Students'
            console.log('Loading')
            // dbFunctions.read('users').then(data => {
            //     if (data === undefined) {
            //         console.log(data)
            //     } else {
            //         console.log("loading into array")
            //         // console.log(data)
            //         Object.keys(data).forEach(function (key) {
            //             console.log(data[key])
            //             allStudents.push(data[key])
            //         });
            //         dataFetch(true)
            //         console.log(allStudents)
            //     }
            // })
            // read data
            function loadData() {
                console.log('loading user data')
                const pathRef = ref(db, `/schools/hvhs/users/`);
                // wait for data
                get(pathRef, (snapshot) => {
                    if (snapshot === undefined) {
                        console.log('no data')
                    }
                    const data = snapshot;
                    console.log(data)
                })
            }
            loadData()

        }
    })
    if (loading === false) {
        return (
            <div>
                <h1>Fetching Data</h1>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={() => dataFetch(false)}>
                    Set False
                </button>
                <h1>Loaded</h1>
            </div>
        )
    }
}

