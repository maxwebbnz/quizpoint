/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let qz_turnedin = {
    quiz: function(_qzid) {
        console.log("qz_turnedin | Turning in quiz")
            //? fetch object from firebase
        var db = firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log("QUIZ NOT THERE!!!")
            } else {
                console.log(snapshot.val())
                data = snapshot.val()
                fb.write(`users`, user.uid + `/quizzes/turnedin/${_qzid}`, data)
                firebase.database().ref(`${defaultPath}/users/${user.uid}/quizzes/active/${_qzid}`).remove()
            }
        });
        cls.display.loadClassPage(currentClassId)
    }
};