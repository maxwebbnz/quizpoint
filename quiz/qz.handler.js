let usersQuizzes = [];
let currentQuiz = {};
let numq = 0;

let quiz = {
    showQuiz: function() {
        switchScreen("classPage", "quizview")
        let usrAgn = user.assigned;
        let assignedWork = [];
        Object.entries(usrAgn).forEach(entry => {
            const [key, value] = entry;
            assignedWork.push(entry)
        });
        for (var i = 0; i < assignedWork.length; i++) {
            // console.log(assignedWork[i])
            let crtItem = assignedWork[i]
            console.log("Class" + crtItem[0])
            console.log("Quiz" + crtItem[1])
            const cq = quizes.some(cd => cd.code >= crtItem[1]);
        }
    },
    start: function(_qzId) {
        var currentQuiz = quizes.filter(function(el) {
            return el.code = _qzId
        });
        // setup variables for quick changing
        let cq = currentQuiz[0]
        let numqdis = numq + 1;
        let name = cq.name
        let author = cq.author
        let scorereq = cq.scorerequired
        let questions = cq.questions
            // dom elements...
        let quiz_qsnum = document.getElementById('quiz-qsnum')
        let quiz_qscnt = document.getElementById('quiz-qscnt')
        let quiz_title = document.getElementById('quiz-title')
        quiz_title.innerHTML = name;
        quiz_qsnum.innerHTML = numqdis;
        document.getElementById('qz').style.display = 'block'
        document.getElementById('quizdue').style.display = 'none'
            // display first question
        if (questions[numq] == undefined) {
            console.log("Quiz over")
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Good work!',
                showConfirmButton: false,
                timer: 1500
            })
            document.getElementById('qz').style.display = 'none'
            document.getElementById('quizdue').style.display = 'block'
        } else {
            quiz_qscnt.innerHTML = questions[numq].question
            let btn = document.getElementById('quiz-submit')
            btn.addEventListener("click", function() {
                // get answer box
                let inpt = document.getElementById('quiz-qsanswer');
                if (inpt.value == questions[numq].answer) {
                    quiz.alert('success')
                    inpt.value = ''
                    numq = numq + 1;
                    quiz.start(_qzId)
                } else {
                    quiz.alert('wrong')
                }
            });
        }
        // listen to next button...

    },
    alert: function(_type) {
        if (_type == "success") {
            var success = Swal.mixin({
                toast: true,
                icon: 'success',
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
            success.fire({
                animation: true,
                title: 'Correct'
            });
        } else if (_type == "wrong") {
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