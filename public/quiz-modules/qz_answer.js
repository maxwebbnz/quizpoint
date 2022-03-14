/*
 * Copyright (c) 2021-2022 QuizPoint
 * All rights reserved.
 */

/**========================================================================
 **                           qz_answer
 *?  Checks answer against required value in quiz objet
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
let qz_answer = {
    /**==============================================
     **              ans
     *?  Sub function of above.
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    ans: function(_e, _t) {
        // check answer against records
        if (qz_check.checkAns(_e, _t)) {
            console.log("ANSWER IS CORRECT!")
                // we would store record to user here
                // userStoreTo.quiz(currentQuiz,currentQuestion, _e)
            fb.write(`users`, user.uid + `/quizzes/active/${currentQuizId}/answers/`, {
                    [currentQuestion]: _e
                })
                // repeat
            fb.write(`users`, user.uid + `/quizzes/active/${currentQuizId}/`, {
                    progress: currentQuestion
                })
                // change question
            qz_progress.next()
                // more questions correct
            questionsCorrect = questionsCorrect + 1;
            // change question
            qz_display.nextQuestion();
        } else {

            console.log("ANSWER IS WRONG!")
                // still store answer
            fb.write(`users`, user.uid + `/quizzes/active/${currentQuizId}/answers/`, {
                    [currentQuestion]: _e
                })
                // repeat
            fb.write(`users`, user.uid + `/quizzes/active/${currentQuizId}/`, {
                    progress: currentQuestion
                })
                // again, change question
            qz_progress.next()
            qz_display.nextQuestion();
        }
    }
}