/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let qz = {}

qz.loadActive = {
    match: function(_uid, _cid) {
        let classQuiz = [];
        let userQuiz = [];
        console.log("qz.loadActive.match | Checking quizzes in class")
        async function readDb() {
            let matchedQuiz = []
            var path = firebase.database().ref(defaultPath + '/classes/' + _cid)
            path.on('value', (snapshot) => {
                if (snapshot.val() == null) {
                    return
                } else {
                    const data = snapshot.val();
                    // classObject = data;
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
                            matchedQuiz.push(userQuiz[i])
                            console.log(`match ${userQuiz[i]}`)
                        } else {
                            console.log(`no match ${userQuiz[i]}`)
                        }
                    }
                }
            });
            return matchedQuiz
        }
        let arrayOfValues = readDb()
        return arrayOfValues;
    }
}