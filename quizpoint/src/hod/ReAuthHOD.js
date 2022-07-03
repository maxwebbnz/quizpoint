/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


import { useGoogleLogin } from '@react-oauth/google';
/**======================
 **   Image and media Imports
 *========================**/
import logo from './media/appicon-itt6.svg'
import googleButton from './media/googleButton.svg'
import schoolMedia from './media/background.png'

/**======================
 **   MUI Imports
 *========================**/
import Button from 'react-bootstrap/Button';


import './ReAuthPage.css'
export default function ReAuthenticateTeacher() {

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
        sessionStorage.setItem('authToken', _token.access_token)
        // start process with session storage
        window.location.reload()
    }

    return (
        <div id="landingPage" className="loginPage" style={{ backgroundImage: `url(${schoolMedia})` }}>
            <div className="loginContainer">
                <div className="logo"><img src={logo} alt="QuizPoint Logo"></img></div>
                <div className="loginText">
                    <h3>Please re-authenticate</h3>
                    <h5>We need to check your identity</h5>
                </div>
                <div className="loginButtons">

                    <Button variant="light" size="lg" className="googleLoginButton" onClick={() => login()} id="authButton"><img src={googleButton}></img>Sign In with Google</Button>
                </div>

            </div>

        </div>)
}