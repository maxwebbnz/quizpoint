/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

let currentCLSLookUpResult
cls.lookup = {
    students: function(_clsid) {
        let usersSearched = [];
        console.log('cls.lookup.students | Performing a look up for ' + _clsid)
        var path = firebase.database().ref(defaultPath + '/classes/' + _clsid + '/students/')
        path.on('value', (snapshot) => {
            if (snapshot.val() == null) {
                return
            } else {
                const data = snapshot.val();
                console.log(data)
                currentCLSLookUpResult = data;
                for (student in currentCLSLookUpResult) {
                    var path = firebase.database().ref(defaultPath)
                    path.child("users").child(student).get().then((snapshot) => {
                        if (snapshot.exists()) {
                            usersSearched.push(snapshot.val())
                        } else {
                            console.log("No data available");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                currentCLSLookUpResult = usersSearched
            }
        });
    }
}