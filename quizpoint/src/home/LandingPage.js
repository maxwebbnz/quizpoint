/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Base Declerations
import './LandingPage.css';
import { LoginFunction } from '../services/Login'
import logo from './media/appicon-itt6.svg'
import mobileLogo from './media/appbranding-itt4withtext.svg'
import schoolMedia from './media/background.jpg'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react';
// Material UI
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Collapse from '@mui/material/Collapse';
import GoogleLogin from 'react-google-login';
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
     **              HandleSignIn
     *?  What does it do? Handles sign in with Google OAuth
     *=============================================**/
    const responseGoogle = (response) => {
        console.log(response);
        console.log(response.accessToken)
        // then read data
        const dbRef = ref(getDatabase());
        // access data
        console.log(response.accessToken)
        get(child(dbRef, `schools/hvhs/users/${response.googleId}`)).then((snapshot) => {
            // if user exists
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setUserObjectLocal(snapshot.val(), response.accessToken)
                // register
            } else {
                registerUser(response.profileObj, response.accessToken)
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }



    /**==============================================
 **              registerUser
 *?  What does it do? Registeres the user in the database
 *@param _userObj object
 *=============================================**/
    function registerUser(_userObj, _token) {
        let userObject = {
            name: _userObj.name,
            email: _userObj.email,
            picture: _userObj.imageUrl,
            studentID: _userObj.email.split('@')[0],
            role: 'student',
            uid: _userObj.googleId,
            classes: {
                notEnrolled: true
            },
            quizzes: {
                active: {
                    notEnrolled: true
                },
                turnedin: {
                    notEnrolled: true
                }
            }
        }
        const db = getDatabase();
        set(ref(db, 'schools/hvhs/users/' + _userObj.googleId), userObject);
        setUserObjectLocal(_userObj, _token)
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
                                        <h2>Welcome to QuizPoint</h2>
                                        <button class="generic-button" onClick={LoginFunction} id="authButton"><i class="bi bi-google"></i> Login with Google</button>

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