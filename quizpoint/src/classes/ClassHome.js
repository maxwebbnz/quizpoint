/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 *
 */

import {user, setUserObjectLocal} from '../firebase/fb.user.js';

const ClassHome = () => {

    return(
        <h2>Class Home page content {user.name}</h2>
    )
}

export default ClassHome