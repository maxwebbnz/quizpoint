/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */


/**========================================================================
 **                           Create Class
 *?  What does it do? Looks after class creation via modal
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
ts.createClass = {
    /**==============================================
     **              DisplayModal
     *?  What does it do? Shows modal
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    displayModal: function() {
        console.log("Displaying Create Class Modal");
        $("#tcs_createClassModal").modal("show");
    },
    /**==============================================
     **              Store
     *?  What does it do? Gets information from the modal, and stores it to firebase
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    store: function() {
        // base declerations
        let studentCSVResults;
        let studentsNoAccount = [];
        // dom elements
        let className = document.getElementById(
            "tcs_createClassModal-inputName"
        ).value;
        let classSubject = document.getElementById(
            "tcs_createClassModal-inputSubject"
        ).value;
        let classTeachers = document.getElementById(
            "tcs_createClassModal-inputTeachers"
        ).value;
        // for validation
        let inputName = false;
        let inputSubject = false;
        let inputTeachers = false;
        // if classname is text
        if (validate.text(className)) {
            //set to true
            inputName = true;
        } else {
            // shake input box to show incorrect
            $("#tcs_createClassModal-inputName").effect("shake");
        }
        // if classubject is text
        if (validate.text(classSubject)) {
            // set to true
            inputSubject = true;
        } else {
            // shake input box to show incorrect
            $("#tcs_createClassModal-inputSubject").effect("shake");
        }
        // you get the idea...
        if (validate.text(classTeachers)) {
            console.log(classTeachers);
            inputTeachers = true;
        } else {
            console.log("not valid");
            $("#tcs_createClassModal-inputTeachers").effect("shake");
        }
        // once everything is validated.
        if (inputSubject & inputName & inputTeachers) {
            //* logging for dev purposes
            console.log("All are correct, checking student list.");
            // get dom element of CSV
            let studentCSVInput = $("#studentImportCSV").prop("files");
            // if there is no CSV file, no need to complete next step.
            if (document.getElementById("studentImportCSV").value == "") {
                //* logging for dev purposes.
                console.log("no file");
            } else {
                // upon getting the value
                Papa.parse($("#studentImportCSV").prop("files")[0], {
                    // download file
                    download: true,
                    // get headers from CSV for keys
                    header: true,
                    /**======================
                     **   complete
                     *? What does this do? Listens for a complete event when file upload is done
                     *@return n/a
                     *========================**/
                    complete: function(results) {
                        // for each row in CSV
                        for (i = 0; i < results.data.length; i++) {
                            //*logging for dev purposes
                            console.log(results.data[i].FirstName);
                            // remove header content from array
                            if (results.data[i].FirstName == "") {
                                results.data.splice(i, 1);
                            }
                        }
                        // set array
                        studentCSVResults = results.data;
                        // find all students UID
                        // generate a new class code
                        let newClassId = 'CLASS_' + generatePushID();
                        // write new class to firebase
                        fb.write("classes", newClassId, {
                                className: inputName,
                                classCreator: 'Max Webb',
                                code: newClassId,
                                quizzes: 'not started',
                                teachers: {
                                    ['placeholderUID']: 'placeholderUID'
                                }
                            })
                            // load users path.
                        var usersPath = firebase.database().ref(defaultPath + "users").orderByChild("studentID").limitToLast(10);
                        // get data from path
                        usersPath.once("value").then((_snapshot) => {
                            // for each user (snapshot)
                            _snapshot.forEach(function(childSnapshot) {
                                // for each record in the studentCSV array
                                for (var i = 0; i < studentCSVResults.length; i++) {
                                    if (
                                        // if student exists in array and in the firebase,
                                        studentCSVResults[i].StudentID ===
                                        childSnapshot.child("studentID").val()

                                    ) {
                                        // add them directly
                                        console.log('match')
                                        fb.write("users", childSnapshot.key + '/classes', {
                                            [newClassId]: {
                                                code: newClassId,
                                            },

                                        });
                                        // add them also to class rec as a reference
                                        fb.write("classes", newClassId, {
                                                students: {
                                                    [childSnapshot.key]: childSnapshot.key
                                                }
                                            })
                                            // does not exist
                                    } else {
                                        //  need to invite them to program.
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
                            // Empty values in input for next round....
                        $('#tcs_createClassModal-inputName').val('');
                        $('#tcs_createClassModal-inputSubject').val('');
                        $('#tcs_createClassModal-inputTeachers').val('');
                        $('#studentImportCSV').val('');
                        $('#tcs_createClassModal').modal('hide');
                        // rerun class page showing....
                        console.log('Created Successfully')

                    },
                });
            }
        }
    },
    /**==============================================
     **              Invite
     *?  What does it do? Sends invite emails with links to new students
     *@param _studentID string
     *@param _name string
     *@param _classId string
     *@param _teacher string
     *@return type
     *=============================================**/
    invite: function(_studentID, _name, _classId, _teacher) {
        // base declreations
        let studentEmail = _studentID + '@hvhs.school.nz'
        let studentName = _name
        let studentInviteCode = _classId
        let teacher = _teacher

        // email information for server
        let object = {
                name: studentName,
                email: studentEmail,
                invite: studentInviteCode,
                teacher: teacher
            }
            // send to server a broadcast event of emailIinvite, transfering the object of student information.
        socket.emit("emailInvite", object);

    }
};