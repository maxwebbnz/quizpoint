/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



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
                        let newClassId = 'CLASS_' + generatePushID();
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