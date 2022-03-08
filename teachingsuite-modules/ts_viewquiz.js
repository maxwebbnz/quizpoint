/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let ts = {}

ts.viewquiz = {
    classList: function(_clsid, _qzid) {
        console.log('ts.viewQuiz | Viewing ' + _clsid)
            //* get firebase information
        var db = firebase.database().ref(`${defaultPath}/classes/${_clsid}/students/`)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                console.log("SORRY CLASS NO EXIST!")
            } else {
                let studentsInClass = []
                let classObject = snapshot.val()
                console.log(classObject)
                for (a in classObject) {
                    console.log(a)
                    var l = firebase.database().ref(`${defaultPath}/`)
                    l.child("users").child(a).get().then((snapshot) => {
                        // if user is existant!
                        if (snapshot.exists()) {
                            //? let st be a student
                            console.log(snapshot.val())
                            let st = snapshot.val()
                            let html = `<li class="list-group-item" id="teachingsuite_classlist-item${st.uid}">${st.name}</li>`
                            $('#teachingsuite_classList').append(html)
                            $(`#teachingsuite_classlist-item${st.uid}`).on("click", function() {
                                console.log(st.uid)
                                ts.viewquiz.result(st, '0001')
                            }); // let html = `<li class="list-group-item" style="background-color: lightgreen;">${st.name}</li>`
                        } else {
                            return;
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                console.log(studentsInClass)
            }
        })
    },
    result: function(_studentObject, _quiz) {
        console.log(_studentObject)
        var userPath = firebase.database().ref(`${defaultPath}/users/${_studentObject.uid}/quizzes/active/${_quiz}`)
        userPath.once('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
            } else {
                alert("error")
            }
        })

    }
}