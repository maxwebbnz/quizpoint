/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Base Declerations
import './LandingPage.css';
import { LoginFunction, oauthSignIn, newSignInModel } from '../services/Login'
import logo from './media/appicon-itt6.svg'
import googleButton from './media/googleButton.svg'
import { useGoogleLogin } from '@react-oauth/google';
import mobileLogo from './media/appbranding-itt4withtext.svg'
import schoolMedia from './media/background.jpg'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react';
// Material UI
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Collapse from '@mui/material/Collapse';
// or
import { getDatabase, ref, child, get, set } from "firebase/database";
import { setUserObjectLocal } from "../firebase/fb.user"
import Button from 'react-bootstrap/Button';


/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {

    const login = useGoogleLogin({
        onSuccess: tokenResponse => startLogin(tokenResponse),
        scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos',

    });

    function startLogin(_token) {
        newSignInModel(_token.access_token)
    }

    // return HTML
    return (
        <div id="landingPage" className="loginPage" style= {{backgroundImage: `url(${schoolMedia})`}}>
            <div className="loginContainer">
                <div className="logo"><img src={logo} alt="QuizPoint Logo"></img></div>
                <div className="loginText"><h1>QuizPoint</h1></div>
                <div className="loginButtons">
                    <Button variant="light" size="lg" className="googleLoginButton" onClick={() => login()} id="authButton"><img src={googleButton}></img>Sign In with Google</Button>
                </div>
            </div>
        </div>
    )
    }
