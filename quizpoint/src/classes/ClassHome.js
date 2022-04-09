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
import { user } from '../firebase/fb.user.js';
// import { db, ref } from '../services/firebase.js';
import './ClassHome.css'

const ClassHome = () => {

    return (
        <div className="class-home">
            <div className="class-header">
                <h2>Welcome, {user.name}</h2>

            </div>
        </div>

    )
}

export default ClassHome