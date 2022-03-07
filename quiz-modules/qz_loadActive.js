/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let qz = {}
let currentQuizId;
qz.loadActive = {
    match: async function(_uid, _cid) {
        $(`#classpage_authed_student-quizassigned`).empty()

        let classQuiz = [];
        let userQuiz = [];
        let matchedQuiz = []
        readDb()
        console.log("qz.loadActive.match | Checking quizzes in class")
        async function readDb() {
            var path = firebase.database().ref(defaultPath + '/classes/' + _cid)
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    return
                } else {
                    const data = snapshot.val();
                    console.log(data)
                    for (a in data.quizzes.active) {
                        classQuiz.push(a)
                        console.log(classQuiz)
                    }
                }
            });
            var paths = firebase.database().ref(defaultPath + '/users/' + _uid)
            paths.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    return
                } else {
                    const data = snapshot.val();
                    // classObject = data;
                    console.log(data)
                    for (a in data.quizzes.active) {
                        userQuiz.push(a)
                    }
                    for (var i = 0; i < userQuiz.length; i++) {
                        if (classQuiz.indexOf(userQuiz[i]) != -1) {
                            // console.log('run')
                            quizAssigned.push(userQuiz[i])
                                // console.log(`match ${userQuiz[i]}`)

                        } else {
                            // console.log(`no match ${userQuiz[i]}`)
                        }
                    }

                }
                //? now fetch quiz info
                for (var i = 0; i < quizAssigned.length; i++) {
                    let b;
                    let id = quizAssigned[i]
                    console.log(quizAssigned[i])
                    var path = firebase.database().ref(defaultPath + '/quizzes/' + quizAssigned[i])
                    path.on('value', (snapshot) => {
                        if (snapshot.val() == null) {
                            console.log('no quiz with that id')

                        } else {
                            const data = snapshot.val();
                            // classObject = data;
                            b = data
                            console.log(b)
                            let html = `<div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title">${b.title}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">${b.description}</h6>
                                            <a href="#" class="card-link" id="quizCard-a-${id}">Start Quiz</a>
                                        </div>
                                        </div>`
                            $(`#classpage_authed_student-quizassigned`).append(html)
                            $(`#quizCard-a-${id}`).on("click", function() {
                                qz_load.getQuiz(id)
                                currentQuizId = id
                            });
                        }
                    });
                }
            });
        }
        return;
        // console.log(quizAssigned)
    }
}