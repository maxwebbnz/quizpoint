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
                            console.log(newClassObject)
                        } else {
                            // no data
                            console.log('no snapshot')
                        }
                    })

                }

            }
        })
    }
}