/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**========================================================================
 **                           qz_turnedin
 *?  What does it do? Turns in quizzes at the end
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
let qz_turnedin = {
    /**==============================================
     **              quiz
     *?  What does it do? Turns in quizzes
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    quiz: function(_qzid) {
        // echo to console
        console.log("qz_turnedin | Turning in quiz")
            //? fetch object from firebase
        var db = firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`)
        db.once('value', (snapshot) => {
            // no quiz?
            if (snapshot.val() == null) {
                console.log("QUIZ NOT THERE!!!")
            } else {
                console.log(snapshot.val())
                    // get data
                data = snapshot.val()
                    // copy it to turnedinpath
                fb.write(`users`, user.uid + `/quizzes/turnedin/${_qzid}`, data)
                    // remove active status
                firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`).remove()
            }
        });
        // return home
        cls.display.loadClassPage(currentClassId)
    }
};