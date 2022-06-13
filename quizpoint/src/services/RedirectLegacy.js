/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


/**==============================================
 *                NOT COMMENTED
 *  ! Probably needs to be removed....
 *=============================================**/
import { useLocation, useNavigate } from 'react-router-dom'

export default function RedirectLegacy() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.pathname);
    //? LEGACY 1: CLASSHOME=>CLASSES
    if (location.pathname === '/classHome') {
        navigate('/classes');
    }
}