/*
 * Copyright (c) 2021 Max Webb
 * All rights reserved.
 */
let qz_answer = {
    ans: function(_e, _t) {
        // check answer against records
        if (qz_check.checkAns(_e, _t)) {
            console.log("ANSWER IS CORRECT!")
            Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Correct!',
                    showConfirmButton: false,
                    timer: 1500
                })
                // we would store record to user here
                // userStoreTo.quiz(currentQuiz,currentQuestion, _e)
            qz_progress.next()
            qz_display.nextQuestion();
        } else {
            console.log("ANSWER IS WRONG!")
            var wrong = Swal.mixin({
                toast: true,
                icon: 'error',
                title: 'General Title',
                animation: false,
                position: 'top-right',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            wrong.fire({
                animation: true,
                title: 'Wrong'
            });
        }
    }
}