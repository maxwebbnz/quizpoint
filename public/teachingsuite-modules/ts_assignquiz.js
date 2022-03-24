/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**================================================================================================
 *? All Comment in this file can be accessed via ts.assignquiz
 *================================================================================================**/


/**========================================================================
 **                           assignQuiz
 *?  What does it do? Houses all modules that are used to assign students quizzes
 *========================================================================**/
let currentQuizToAssign;
ts.assignQuiz = {
    /**==============================================
     **              showModal
     *?  What does it do? Shows the modal to the client/enduser
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    showModal: function(_quizKey) {
        _quizKey = 'QUIZ_-MyeZhMAweDRg-YsIc7E'
        console.log("ts.assignQuiz.showModal() | Showing modal to assign for " + _quizKey)
        $("#tcs_assignQuizModal").modal("show");
        ts.assignQuiz.fetchTeachersClasses();
        currentQuizToAssign = _quizKey
    },
    /**==============================================
     **              fetchTeachersClasses
     *?  What does it do? Gets all teachers classes and appends the select boxes
     *@return type
     *=============================================**/
    fetchTeachersClasses: function() {
        console.log('tcs.assignQuiz.fetchTeacherClasses - Fetching teachers class.')

        let teacherPath = firebase.database().ref(`${defaultPath}/users/${'u0lMN5qOyRNpkRgOyeyQ4woNHRu1'}/classes/`)
        teacherPath.once('value', (snapshot) => {
            // data exist?
            if (snapshot.val() == null) {
                console.log("SORRY CLASS NO EXIST!")
                    // the logic starts here
            } else {
                // setup a class keys array
                let classKeys = []
                let actualClasses = []
                console.log(snapshot.val())
                $.each(snapshot.val(), function(key) {
                    // let key be the class id
                    //* log for testing purposes
                    console.log(key)
                    classKeys.push(key)
                });
                // then, load class information
                for (var i = 0; i < classKeys.length; i++) {
                    console.log(classKeys[i])
                        // pull class from firebase
                    let classPath = firebase.database().ref(`${defaultPath}/classes/${classKeys[i]}/`)
                    classPath.once('value', (snapshot) => {
                        if (snapshot.val()) {
                            console.log(snapshot.val())
                                // append new array object to now have more information
                            let newClassObject = {
                                key: snapshot.key,
                                name: snapshot.val().className
                            }
                            let option = `<option value="${newClassObject.key}">${newClassObject.name}</option>`
                            $('#tcs_assignQuizModal-selectedClass').append(option)
                                // end of function.
                        } else {
                            // no data
                            console.log('no snapshot')
                        }
                    })

                }
                $('#tcs_assignQuizModal-save').on('click', function() {
                    ts.assignQuiz.assign($('#tcs_assignQuizModal-selectedClass').val())
                })

            }
        })
    },
    /**==============================================
     **              assign
     *?  What does it do? Does the actual assigning of data to students and class
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    assign: function(_classId, _className) {
        console.log("Assigning all students in " + _classId + " with a quiz!")
        try {
            // write to class to add to active quizzes
            fb.write('classes', _classId + '/quizzes/active/' + currentQuizToAssign, {
                code: currentQuizToAssign,
                progress: 0
            })

            // get all students in that class
            let classPath = firebase.database().ref(`${defaultPath}/classes/${_classId}/`)
            classPath.once('value', (snapshot) => {
                    if (snapshot.val()) {
                        // students exist
                        console.log(snapshot.val().students)
                        $.each(snapshot.val().students, function(key) {
                            // let key be the class id
                            //* log for testing purposes
                            console.log(key)
                                // then, write to each user path with a new quiz due.
                            fb.write('users', key + '/quizzes/active/' + currentQuizToAssign, {
                                code: currentQuizToAssign,
                                progress: 0
                            })
                        });
                    } else {
                        // no students
                        console.log('no students')
                    }
                })
                // hide elements
            $("#tcs_assignQuizModal").modal("hide");
            // remove options
            $('#tcs_assignQuizModal-selectedClass').empty()
                // success!
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Quiz assigned to class',
                showConfirmButton: false,
                timer: 1500
            })

            // if error occurs
        } catch (_error) {
            // log to console
            console.log(_error)
                // styled alert
            Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "We couldn't assign your quiz",
                    footer: 'Please try again later.'
                })
                // close window
            ts.assignQuiz.close()
        }

    },
    /**==============================================
     **              closeModal
     *?  What does it do? Handles closing of modal, and resetting of elements.
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    close: function() {
        // hide elements
        $("#tcs_assignQuizModal").modal("hide");
        // remove options
        $('#tcs_assignQuizModal-selectedClass').empty()
    }
}