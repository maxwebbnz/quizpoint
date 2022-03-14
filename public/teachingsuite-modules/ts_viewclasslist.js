/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**========================================================================
 **                           viewclasslist
 *?  What does it do? Module to handle class lists for the teaching suite
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/

ts.viewclasslist = {
    /**==============================================
     **              Load Class List 
     *! NOT WORKING CURRENTLY
     *?  Loads a class list based on a cls id
     *@param _clsid variable
     *@return type n/a
     *=============================================**/
    loadClassList: function(_clsid) {
        // base delecrations
        let teachersList = []
            // dev log
        console.log(`Loading Class List for ${_clsid}`)
            // get teacher data.
        var db = firebase.database().ref(`${defaultPath}/classes/${_clsid}/teachers/`)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {

            } else {
                // add each uid to array
                for (teacherUID in snapshot.val()) {
                    teachersList.push(teacherUID)
                }
                // for each value in teacherlist
                for (var i = 0; i < teachersList.length; i++) {
                    // load that user  information
                    var l = firebase.database().ref(defaultPath + '/users/' + teachersList[i]);
                    l.once('value', (snapshot) => {
                        if (snapshot.val() == null) {

                        } else {
                            // setup table row
                            let html = `<tr>
                            <td>${snapshot.val().name}</td>
                            <td>${snapshot.val().email}</td>`
                                //*EVERYTHING BELOW I AM TESTING!                            
                            let count = 0;

                            for (a in snapshot.val().classes) {
                                var l = firebase.database().ref(defaultPath + '/classes/' + a);
                                l.once('value', (snapshot) => {
                                    if (snapshot.val() == null) {
                                        return
                                    } else {
                                        if (count == 0) {
                                            html += `<td>${snapshot.val().className}</td></tr>`
                                        }
                                    }
                                })
                            }
                            $('#classlist_teacherTable tbody').append(html)
                            className(snapshot.val().classes).then((name) => {
                                $(`#viewQuizResultTable tbody`).append(htmlContentToAppend)

                            })
                            console.log(snapshot.val().classes)

                        }
                    })
                }
            }
        })
    }
}