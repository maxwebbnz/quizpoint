/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
qz.loadCompleted = {
    match: async function(_uid, _cid) {
        // empty html justincase
        $(`#classpage_authed_student-quizassigned`).empty()
            // variable detup
        let classQuiz = [];
        let userQuiz = [];
        let matchedQuiz = []
            // read database (async function)
        readDb()
        console.log("qz.loadActive.match | Checking quizzes in class")
            /**======================
             **   readDb
             *========================**/
        async function readDb() {
            //load class quizzes
            var path = firebase.database().ref(defaultPath + '/classes/' + _cid)
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    return
                } else {
                    // return quizzes assigned to class
                    const data = snapshot.val();
                    for (a in data.quizzes.active) {
                        classQuiz.push(a)
                        console.log(classQuiz)
                    }
                }
            });
            // check quizzess active in the user path
            var paths = firebase.database().ref(defaultPath + '/users/' + _uid)
            paths.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    return
                } else {
                    // repeat of actions above, but now for the user
                    const data = snapshot.val();
                    for (a in data.quizzes.turnedin) {
                        userQuiz.push(a)
                    }
                    for (var i = 0; i < userQuiz.length; i++) {
                        if (classQuiz.indexOf(userQuiz[i]) != -1) {
                            quizAssigned.push(userQuiz[i])
                        } else {}
                    }

                }
                //? now fetch quiz info
                for (var i = 0; i < quizAssigned.length; i++) {
                    // variables for use (b could well be x,y,z :P)
                    let b;
                    let id = quizAssigned[i]
                        // get quiz information
                    var path = firebase.database().ref(defaultPath + '/quizzes/' + quizAssigned[i])
                    path.on('value', (snapshot) => {
                        if (snapshot.val() == null) {
                            console.log('no quiz with that id')
                        } else {
                            console.log(snapshot.val())
                            const data = snapshot.val();
                            b = data
                                // setup html
                            let html = `<div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title">${b.title}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">${b.description}</h6>
                                            <a href="#" class="card-link" id="quizCard-a-${id}">Start Quiz</a>
                                        </div>
                                        </div>`
                                // add it to the page
                            $(`#classpage_authed_student-quizcompleted`).append(html)
                                //if clicked, start quiz
                        }
                    });
                }
            });
        }
        return;
        // console.log(quizAssigned)
    }

}