/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Base Declerations
import './LandingPage.css';
import { LoginFunction } from '../services/Login'
import logo from './media/appbranding-itt4withtext.svg'
import schoolMedia from './media/background.jpg'
import { useMediaQuery } from 'react-responsive'


/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    if (isBigScreen || isDesktopOrLaptop) {
        // return HTML
        return (
            <div id="landingPage" class="homePageMain">
                <div class="backgroundImage-landingpage">
                    <img src={schoolMedia} alt=" " id="schoolMedia-background" width="100%" height="100%"></img>

                    <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                        <img src={logo} alt="triangle with all three sides equal"></img>
                        <div class="homePageActions">
                            <div class="authContent text-center">
                                <h2>Welcome</h2>
                                <button class="generic-button" onClick={LoginFunction} id="authButton"><i class="bi bi-google"></i> Login with Google</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        )
    } else if (isTabletOrMobile) {
        // return HTML
        return (
            <div id="landingPage" class="homePageMain">
                <div class="backgroundImage-landingpage">
                    <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                        <img src={logo} alt="triangle with all three sides equal"></img>
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