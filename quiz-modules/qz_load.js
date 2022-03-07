/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let currentQuiz = []
let currentQuestion = 0;
let questionsCorrect = 0;

let qz_load = {
    getQuiz: function(_qzid) {
        var db = firebase.database().ref(defaultPath + '/quizzes/' + _qzid)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log("QUIZ NOT THERE!!!")
            } else {
                console.log(snapshot.val().questions.length)
                let questionsArray = snapshot.val().questions
                for (var i = 0; i < questionsArray.length; i++) {
                    currentQuiz.push(questionsArray[i])
                }
                var userPath = firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`)
                userPath.once('value', (snapshot) => {
                        if (snapshot.val().progress == null) {
                            currentQuestion = currentQuestion + 1;
                        } else {
                            currentQuestion = snapshot.val().progress
                        }
                    })
                    // set current quesiton
            }
            qz_display.start()
        });
    }
}