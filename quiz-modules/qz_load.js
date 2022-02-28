/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let currentQuiz = []
let currentQuestion = 0;

let qz_load = {
    getQuiz: function() {
        var db = firebase.database().ref(defaultPath + '/quizzes/0001')
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log("QUIZ NOT THERE!!!")
            } else {
                console.log(snapshot.val().questions.length)
                let questionsArray = snapshot.val().questions
                for (var i = 0; i < questionsArray.length; i++) {
                    currentQuiz.push(questionsArray[i])
                }
                // set current quesiton
                currentQuestion = currentQuestion + 1;
            }
            qz_display.start()
        });
    }
}