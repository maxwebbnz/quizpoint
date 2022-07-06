/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


import { useState, useEffect } from 'react';
import { Input } from '@mui/material'

import './Setup.css'
import { db } from '../services/firebase'
import { onValue, ref, get, getDatabase } from 'firebase/database';
export default function Setup() {
    const [currentName, setName] = useState('')
    const [currentDomain, setDomain] = useState('')
    const [curentEmail, setEmail] = useState('')
    const [loadingInformation, setLoading] = useState(true)
    useEffect(() => {
        if (loadingInformation) {
            let pathRef = '/schools/hvhs/info'
        } else {

        }
    }, [loadingInformation])


    function exportData() {
        // variables for pdfs and excel documents
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;
        let pathRef = ref(db, `/schools/hvhs`);
        onValue(pathRef, (snapshot) => {
            let dataStr = JSON.stringify(snapshot.val());
            let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            let exportFileDefaultName = `QuizPoint Backup on ${today}.json`;

            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        })
    }

    function handleInput(e) {
        console.log(e.target.files)
        console.log(JSON.parse(e.target.files[0]))

    }
    return (
        <div className='cont'>
            <h1>QuizPoint Setup</h1>

            <div className='setup-container'>
                <div className='setup-item'>
                    <h5>School Name</h5>
                    <Input placeholder='School Name' />
                </div>
                <div className='setup-item'>
                    <h5>School Domain (i.e hvhs.school.nz)</h5>
                    <Input placeholder='School HD' />
                </div>
                <div className='setup-item'>
                    <h5>Contact Email (i.e katie.long@hvhs.school.nz)</h5>
                    <Input placeholder='School HoD' />
                </div>
            </div>
            <button className='generic-button sml'>Save Information</button>
            <button className='generic-button sml' onClick={() => exportData()}>Export Data</button>
            <input type={'file'} id={'import-file'} onChange={handleInput} />
        </div>
    )
}