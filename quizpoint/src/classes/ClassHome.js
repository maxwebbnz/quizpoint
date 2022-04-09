/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 *
 */
// import statements
import {user} from '../firebase/fb.user.js';
// import { db, ref } from '../services/firebase.js';


const ClassHome = () => {

    return(
        <div className="class-home">
        <h2>Class Home page content {user.name}</h2>
        </div>

    )
}

export default ClassHome