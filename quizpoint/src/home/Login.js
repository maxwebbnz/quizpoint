/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// User Model
import user from '../User/UserModel'
import {readData} from '../firebase/fb.io'

const Login = () => {
    // let userData =
    // readData('users/WysABYQOvwRDv77aF3Ult8H5dmw2/').name
    if(user.authed) return (<h2>Signed in {}</h2>)
    return 


export default Login