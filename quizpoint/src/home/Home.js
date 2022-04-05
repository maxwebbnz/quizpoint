/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// User Model
import user from '../User/UserModel'
import {readData} from '../firebase/fb.io'

const Home = () => {
    // let userData =
    // readData('users/WysABYQOvwRDv77aF3Ult8H5dmw2/').name
    if(user.authed){
    return(
        <h2>Signed in {}</h2>
    )
    }else{
        return(
            <h2>You are not signed in</h2>
        )
    }

}

export default Home