let qz_answer = {
    ans: function(_e) {
        // check answer against records
        if (qz_check.checkAns(_e)) {
            console.log("ANSWER IS CORRECT!")
                // we would store record to user here
                // userStoreTo.quiz(currentQuiz,currentQuestion, _e)

        } else {
            console.log("ANSWER IS WRONG!")
        }
    }
}