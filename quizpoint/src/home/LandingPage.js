/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Base Declerations
import './LandingPage.css';
import { LoginFunction, oauthSignIn, newSignInModel } from '../services/Login'
import logo from './media/appicon-itt6.svg'
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



/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const shouldBackdrop = true



    /**==============================================
     **              useGoogleLogin
     *?  What does it do? Configuration for login service
     *@return token, google
     *=============================================**/
    const login = useGoogleLogin({
        onSuccess: tokenResponse => startLogin(tokenResponse),
        scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos',

    });

    /**==============================================
     **              startLogin
     *?  What does it do? Handles the login process after the google login service.
     *@param _token - token from google login service
     *=============================================**/
    function startLogin(_token) {
        newSignInModel(_token.access_token)
    }

    const MyFade = ({
        children,
        in: In = true,
        timeout = 1000,
        delay = 0
    }) => {
        const [isIn, setIsIn] = useState(In && delay === 0)

        useEffect(() => {
            if (delay > 0) {
                setTimeout(() => setIsIn(true), delay)
            }
        })

        return (
            <Fade in={isIn} timeout={timeout}>
                {children}
            </Fade>
        )
    }


    if (isBigScreen || isDesktopOrLaptop) {
        // return HTML
        return (
            <div id="landingPage" class="homePageMain">
                <div class="backgroundImage-landingpage">
                    <MyFade in timeout={{ enter: 2000 }} delay={100}><img src={schoolMedia} alt=" " id="schoolMedia-background" width="100%" height="100%"></img></MyFade>

                    <Backdrop
                        sx={{ color: '#b5b5b5', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={shouldBackdrop}
                    >
                        <Collapse in={shouldBackdrop}>
                            <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                                <img src={logo} className="logo-icon" alt="triangle with all three sides equal"></img>
                                <div class="homePageActions">
                                    <div class="authContent text-center">
                                        <h2>QuizPoint</h2>
                                        <button class="generic-button" onClick={() => login()} id="authButton"><i class="bi bi-google"></i> Login with Google</button>

                                    </div>

                                </div>
                            </div>
                        </Collapse>
                    </Backdrop>

                </div>
            </div>

        )
    } else if (isTabletOrMobile) {


        // return HTML
        return (
            <div id="landingPage" class="homePageMain">
                <div class="backgroundImage-landingpage">
                    <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                        <img src={mobileLogo} alt="triangle with all three sides equal"></img>
                        <div class="homePageActions">
                            <div class="authContent text-center">
                                <h2>Please Log in</h2>
                                <div className="g-signin2" data-onsuccess="onSignIn"></div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}