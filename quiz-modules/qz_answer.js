/*
 * Copyright (c) 2021-2022 QuizPoint
 * All rights reserved.
 */
let qz_answer = {
    ans: function(_e, _t) {
        // check answer against records
        if (qz_check.checkAns(_e, _t)) {
            console.log("ANSWER IS CORRECT!")
                // we would store record to user here
                // userStoreTo.quiz(currentQuiz,currentQuestion, _e)
            qz_progress.next()
            questionsCorrect = questionsCorrect + 1;
            qz_display.nextQuestion();
        } else {
            console.log("ANSWER IS WRONG!")
            qz_progress.next()
            qz_display.nextQuestion();
        }
    }
}