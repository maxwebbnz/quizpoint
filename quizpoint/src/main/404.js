/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import './errorpage.css'
import logo from './components/appicon-itt6.svg'

import { Image, Button } from 'react-bootstrap'
const errorPageNotFound = () => {
    return (
        <div className="error-page">
            <div className='branding'>
                <Image src={logo} width='100'></Image>
            </div>
            <div className="error">
                <h2><b>404 | Not Found</b></h2>
                <Button href="/">Return Home</Button>
            </div>
        </div>
    )
}

export default errorPageNotFound

