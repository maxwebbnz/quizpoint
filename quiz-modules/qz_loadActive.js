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
        var path = firebase.database().ref(defaultPath + '/classes/' + _cid)
        path.on('value', (snapshot) => {
            if (snapshot.val() == null) {
                return
            } else {
                const data = snapshot.val();
                // classObject = data;
                classQuiz.push(Object.keys(data.quizzes.active)[0])
            }
        });
        var path = firebase.database().ref(defaultPath + '/users/' + _uid)
        path.on('value', (snapshot) => {
            if (snapshot.val() == null) {
                return
            } else {
                const data = snapshot.val();
                // classObject = data;
                userQuiz.push(Object.keys(data.quizzes.active)[0])
            }
        });
        console.log(classQuiz)
        console.log(userQuiz)
    }
}