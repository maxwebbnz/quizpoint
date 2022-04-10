/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

import { dbFunctions } from "./firebase";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
/* Importing the async function from the firebase util package. */
// import { async } from "@firebase/util";

/**========================================================================
 *                             Invite Module
 *========================================================================**/


let currentClassObject;


export default function Invite() {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        console.log(currentClassObject)
    }, [loading])
    let { id } = useParams()
    console.log(id)
    dbFunctions.read('classes/' + id).then(function (snapshot) {
        if (snapshot === undefined) {
            console.log('no class found')
        } else {
            console.log(snapshot)
            currentClassObject = snapshot
            setLoading.setState(true)
        }
    })

    // let className = classObject.className

}