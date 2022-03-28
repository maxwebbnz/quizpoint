/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Base Variables*\\
let currentQuiz = []
let currentQuestion = 0;
let questionsCorrect = 0;
let currentQuizName;
/**========================================================================
 **                           qz_load
 *?  Gets the quiz for the user before it begins.
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
let qz_load = {
    /**==============================================
     **              getQuiz
     *?  Performs logical methods to get a quiz from db
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    getQuiz: function(_qzid) {
        // read database
        var db = firebase.database().ref(defaultPath + '/quizzes/' + _qzid)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log("QUIZ NOT THERE!!!")
            } else {
                // set question up in base variables above
                let questionsArray = snapshot.val().questions
                let currentQuizName = snapshot.val().title
                for (var i = 0; i < questionsArray.length; i++) {
                    currentQuiz.push(questionsArray[i])
                }
                // find progress if started previously
                var userPath = firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`)
                userPath.once('value', (snapshot) => {
                        if (snapshot.val().progress == null) {
                            currentQuestion = currentQuestion + 1;
                        } else {
                            // currentQuestion = snapshot.val().progress
                            currentQuestion = currentQuestion + 1;

                            console.log(snapshot.val().progress)
                        }
                    })
                    // set current quesiton
            }
            // start quiz
            qz_display.start()
        });
    }
}