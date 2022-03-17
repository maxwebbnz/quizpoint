/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

generatePushID = (function() {
    var PUSH_CHARS =
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var lastPushTime = 0;
    var lastRandChars = [];

    return function() {
        var now = new Date().getTime();
        var duplicateTime = now === lastPushTime;
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error("We should have converted the entire timestamp.");

        var id = timeStampChars.join("");

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error("Length should be 20.");

        return id;
    };
})();

ts.createClass = {
    displayModal: function() {
        console.log("Displaying Create Class Modal");
        $("#tcs_createClassModal").modal("show");
    },
    store: function() {
        let studentCSVResults;
        let studentsNoAccount = [];
        let className = document.getElementById(
            "tcs_createClassModal-inputName"
        ).value;
        let classSubject = document.getElementById(
            "tcs_createClassModal-inputSubject"
        ).value;
        let classTeachers = document.getElementById(
            "tcs_createClassModal-inputTeachers"
        ).value;
        let inputName = false;
        let inputSubject = false;
        let inputTeachers = false;
        if (validate.text(className)) {
            console.log(className);
            inputName = true;
        } else {
            console.log("not valid");
            $("#tcs_createClassModal-inputName").effect("shake");
        }
        if (validate.text(classSubject)) {
            console.log(classSubject);
            inputSubject = true;
        } else {
            console.log("not valid");
            $("#tcs_createClassModal-inputSubject").effect("shake");
        }

        if (validate.text(classTeachers)) {
            console.log(classTeachers);
            inputTeachers = true;
        } else {
            console.log("not valid");
            $("#tcs_createClassModal-inputTeachers").effect("shake");
        }

        if (inputSubject & inputName & inputTeachers) {
            console.log("All are correct, checking student list.");
            let studentCSVInput = $("#studentImportCSV").prop("files");
            if (document.getElementById("studentImportCSV").value == "") {
                console.log("no file");
            } else {
                Papa.parse($("#studentImportCSV").prop("files")[0], {
                    download: true,
                    header: true,
                    complete: function(results) {
                        for (i = 0; i < results.data.length; i++) {
                            console.log(results.data[i].FirstName);
                            if (results.data[i].FirstName == "") {
                                results.data.splice(i, 1);
                            }
                        }
                        studentCSVResults = results.data;
                        // find all students UID
                        // generate a new class code
                        let newClassId = generatePushID();
                        fb.write("classes", newClassId, {
                            className: inputName,
                            classCreator: 'Max Webb',
                            code: newClassId,
                            quizzes: 'not started',
                            teachers: {
                                ['placeholderUID']: 'placeholderUID'
                            }
                        })

                        var usersPath = firebase.database().ref(defaultPath + "users").orderByChild("studentID").limitToLast(10);
                        usersPath.once("value").then((_snapshot) => {
                            console.log(_snapshot.val());
                            _snapshot.forEach(function(childSnapshot) {
                                for (var i = 0; i < studentCSVResults.length; i++) {
                                    if (
                                        studentCSVResults[i].StudentID ===
                                        childSnapshot.child("studentID").val()

                                    ) {
                                        console.log('match')
                                        fb.write("users", childSnapshot.key + '/classes', {
                                            [newClassId]: {
                                                code: newClassId,
                                            },

                                        });
                                        fb.write("classes", newClassId, {
                                            students: {
                                                [childSnapshot.key]: childSnapshot.key
                                            }
                                        })
                                    } else {
                                        console.log("NO MATCH " + studentCSVResults[i].StudentID);
                                        // ts.createClass.invite(studentCSVResults[i].StudentID, studentCSVResults[i].FirstName, newClassId, 'Max Webb');

                                    }
                                }
                            });
                        });
                        // styled alert..
                        Swal.fire(
                            'Kia ora!',
                            'Class Created',
                            'success'
                        )
                        $('#tcs_createClassModal-inputName').val('');
                        $('#tcs_createClassModal-inputSubject').val('');
                        $('#tcs_createClassModal-inputTeachers').val('');
                        $('#studentImportCSV').val('');
                        $('#tcs_createClassModal').modal('hide');
                        //? rerun class page showing....
                        console.log('Created Successfully')

                    },
                });
            }
        }
    },
    invite: function(_studentID, _name, _classId, _teacher) {
        let studentEmail = _studentID + '@hvhs.school.nz'
        let studentName = _name
        let studentInviteCode = _classId
        let teacher = _teacher


        let object = {
            name: studentName,
            email: studentEmail,
            invite: studentInviteCode,
            teacher: teacher
        }

        socket.emit("emailInvite", object);

    }
};