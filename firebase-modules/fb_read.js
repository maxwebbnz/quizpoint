/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// let fb = {}

fb.read = function(_path) {
    console.log("fb.read | Reading " + _path)
    var path = firebase.database().ref(defaultPath + '/' + _path)
    path.on('value', (snapshot) => {
        const data = snapshot.val();
        return data
    });
}

fb.fetchQuiz = function(_qzId) {
    console.log("fb.fetchQuiz | Reading quiz ID " + _qzId)
    var path = firebase.database().ref(defaultPath + '/quizzes/' + _qzId)
    path.on('value', (snapshot) => {
        const data = snapshot.val();
        return data
    });
}