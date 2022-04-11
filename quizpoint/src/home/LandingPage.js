/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// Base Declerations
import './LandingPage.css';
import { LoginFunction } from '../services/Login'
import logo from '../main/components/logo.svg'

/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    // return HTML
    return (
        <div id="landingPage" class="homePageMain">
            <div class="backgroundImage-landingpage">
                <img src="media/background.jpg" alt=" " id="schoolMedia-background" width="100%" height="100%"></img>
                <div class="schoolBranding">
                    <img src="media/schoologo.png" alt=""></img>
                </div>
                <div class="homePageContent center-screen" id='landingPagetoAnimate'>
                    <img src="media\branding\appbranding-itt4withtext.svg" alt="triangle with all three sides equal"></img>
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
}