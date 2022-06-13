/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**======================
 **   React Imports
 *========================**/
import { useState, useEffect } from 'react';

/**======================
 **   Data Service/Auth model Imports
 *========================**/
import { newSignInModel } from '../services/Login'
import { useGoogleLogin } from '@react-oauth/google';

/**======================
 **   Image and media Imports
 *========================**/
import logo from './media/appicon-itt6.svg'
import googleButton from './media/googleButton.svg'
import schoolMedia from './media/background.jpg'

/**======================
 **   MUI Imports
 *========================**/
import Button from 'react-bootstrap/Button';
/**======================
 **   Stylesheet Imports
 *========================**/
import './LandingPage.css';

/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    // states
    const [logInStarted, setLogin] = useState(false)
    /**======================
     **   login -> useGoogleLogin
     *?   login with google
     *========================**/
    const login = useGoogleLogin({
        // if login success -> start login process
        onSuccess: tokenResponse => startLogin(tokenResponse),
        // scopes for permissons
        scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos',

    });

    /**======================
     **   startLogin
     *?  start login process
     *========================**/
    function startLogin(_token) {
        console.log(_token)
        // set state
        setLogin(true)
        // start process with session storage
        newSignInModel(_token.access_token)
    }


    // return JSX
    return (
        <div id="landingPage" className="loginPage" style={{ backgroundImage: `url(${schoolMedia})` }}>
            <div className="loginContainer">
                <div className="logo"><img src={logo} alt="QuizPoint Logo"></img></div>
                <div className="loginText"><h1>QuizPoint</h1></div>
                <div className="loginButtons">

                    <Button variant="light" size="lg" className="googleLoginButton" onClick={() => LoginFunction()} id="authButton"><img src={googleButton}></img>Sign In with Google</Button>
                </div>
                <div className='footer'>
                    <p>Copyright 2022</p>
                    <p>Created by Max Webb and Alan McIlwaine</p>

                </div>


            </div>

        </div>
    )
}
