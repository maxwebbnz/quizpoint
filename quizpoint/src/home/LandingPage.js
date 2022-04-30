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

/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const shouldBackdrop = true

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
                        <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                            <img src={logo} className="logo-icon" alt="triangle with all three sides equal"></img>
                            <div class="homePageActions">
                                <div class="authContent text-center">
                                    <h2>Welcome to QuizPoint</h2>
                                    <button class="generic-button" onClick={LoginFunction} id="authButton"><i class="bi bi-google"></i> Login with Google</button>

                                </div>

                            </div>
                        </div>
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
                                <button class="generic-button" onClick={LoginFunction} id="authButton"><i class="bi bi-google"></i> Login with Google</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}