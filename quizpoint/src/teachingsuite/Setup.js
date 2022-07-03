/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


import { useState, useEffect } from 'react';
import { Input } from '@mui/material'

import './Setup.css'
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
        </div>
    )
}