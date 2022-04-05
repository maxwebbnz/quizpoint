/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// User Model
import user from '../User/UserModel'

const Home = () => {
    if(user.authed){
    return(
        <h2>Signed in</h2>
    )
    }else{
        return(
            <h2>You are not signed in</h2>
        )
    }

}

export default Home