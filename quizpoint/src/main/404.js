/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**======================
 **  Stylesheet Imports
 *========================**/
import './errorpage.css'
/**======================
 **   Media service Imports
 *========================**/
import logo from './components/appicon-itt6.svg'
/**======================
 **   Bootstrap? Imports
 *! Needs to be refactored to MUI
 *========================**/
import { Image, Button } from 'react-bootstrap'
/**========================================================================
 **                           errorPageNotFound
 *?  What does it do? Shows error page when not found
 *@return JSX, html rendered content
 *========================================================================**/
const errorPageNotFound = () => {
    // return JSX
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

// export page
export default errorPageNotFound

