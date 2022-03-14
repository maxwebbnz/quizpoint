/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**========================================================================
 **                           View Student
 *?  Displays student information in a modal for teacher to view or use data to export.
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
ts.viewstudent = {
    /**==============================================
     **              Load Information
     *?  Does bulk of the work for the loading of the user information
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    loadInformation: function(_studentUID) {
        // empty html element
        $('#teachingsuite_classviewbystudent-authed').empty();
        // get user information
        var userPath = firebase.database().ref(`${defaultPath}/users/${_studentUID}`)
        userPath.once('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())

                // setup html
                let html = ''
                    // append html with information relevant to the user
                html += `<div id="studentInfoModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg" id="studentInfoModalContentAppend">

                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">${snapshot.val().name} - ${snapshot.val().studentID}</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>

                    </div>
                    <div class="modal-body">
                        <p>Student Results</p>
                        <button onclick="ts.viewstudent.pdf('${snapshot.val().name}', '${snapshot.val().studentID}')">Export Results to PDF</button>
                        <table class="table" id="studentViewResulttable">
                            <thead>
                                <tr>
                                    <td>Quiz</td>
                                    <td>Progress</td>
                                    <td>Score</td>
                                    <td>Completion</td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`
                    // for each quiz that has been turned in
                for (quizID in snapshot.val().quizzes.turnedin) {
                    // setup table row and variables
                    let tableRow = `<tr>`
                    let correct = 0;
                    // read quiz information
                    var turnedinPath = firebase.database().ref(`${defaultPath}/quizzes/${quizID}`)
                    turnedinPath.once('value', (snapshot) => {
                        // setup names and values
                        let qzName = snapshot.val().title
                        let qzAmount;
                        // find out amounts that are right
                        if (snapshot.val().questions.length == null) {
                            qzAmount = 0
                        } else {
                            qzAmount = snapshot.val().questions.length
                        }
                        // setup variables
                        let printQzAmount;
                        if (qzAmount === 0) {
                            printQzAmount = 0
                        } else {
                            printQzAmount = (qzAmount - 1)
                        }
                        // append table row
                        tableRow += `<td>${qzName}</td>`
                            // now read on active path
                        var activePath = firebase.database().ref(`${defaultPath}/users/${_studentUID}/quizzes/active/${quizID}`)
                        activePath.once('value', (snapshot) => {
                                if (snapshot.val() === null) {
                                    // not there
                                } else {
                                    // check progress
                                    let progress = 0;
                                    if (snapshot.val().progress == undefined) {

                                    } else {
                                        progress = snapshot.val().progress

                                    }
                                    // check if user is correct
                                    for (var i = 1; i < snapshot.val().length; i++) {
                                        console.log(snapshot.val()[i].answers.userInput + ' in compartive to ' + snapshot.val()[i].answers.answer)
                                        if (snapshot.val()[i].answers.userInput === snapshot.val()[i].answers.answer) {
                                            correct += 1
                                        }
                                    }
                                    // add to table 
                                    //? e.g 9/10
                                    tableRow += `<td>${correct}/${(printQzAmount)}</td>`
                                        // check progress and display relevant category
                                        //? e.g Complete, All Correct, Incomplete, Not Started, etc.
                                    if (progress == (qzAmount - 1)) {
                                        console.log("This user has completed the quiz")
                                        if (correct == printQzAmount) {
                                            correctOrNot += 'All Correct'
                                        }
                                        tableRow += `<td style="background-color: lightgreen;">Turned In (${correctOrNot})</td>
`
                                    } else if (progress == Math.round((qzAmount - 1) / 2)) {
                                        console.log("This user has nearly completed the quiz")
                                        tableRow += `<td style="background-color: orange ; width:50%;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                                    } else if (progress == 1) {
                                        console.log("User has barely completed the quiz")
                                        tableRow += `<td style="background-color: orange ;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                                    } else if (progress < (qzAmount - 1)) {
                                        console.log("User has barely completed the quiz, therefore is an imcomplete")
                                        tableRow += `<td style="background-color: red ;">Incomplete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`
                                    }
                                    // add to modal div
                                    $('#studentViewResulttable tbody').append(tableRow + '</tr>')
                                }
                            })
                            // repeated for turned in values
                        var turnin = firebase.database().ref(`${defaultPath}/users/${_studentUID}/quizzes/turnedin/${quizID}`)
                        turnin.once('value', (snapshot) => {
                            if (snapshot.val() === null) {
                                // not there
                            } else {
                                let progress = 0;
                                if (snapshot.val().progress == undefined) {

                                } else {
                                    progress = snapshot.val().progress

                                }
                                tableRow += `<td>${progress}</td>`

                                for (var i = 1; i < snapshot.val().length; i++) {
                                    if (snapshot.val()[i].answers.userInput === snapshot.val()[i].answers.answer) {
                                        correct += 1
                                    }
                                }
                                tableRow += `<td>${correct}/${(printQzAmount)}</td>`
                                if (progress == (qzAmount - 1)) {
                                    console.log("This user has completed the quiz")
                                    let correctOrNot = ''
                                    if (correct == printQzAmount) {
                                        correctOrNot += 'All Correct'
                                    }
                                    tableRow += `<td style="background-color: lightgreen;">Turned In (${correctOrNot})</td>
`
                                } else if (progress == Math.round((qzAmount - 1) / 2)) {
                                    console.log("This user has nearly completed the quiz")
                                    tableRow += `<td style="background-color: orange ; width:50%;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                                } else if (progress == 1) {
                                    console.log("User has barely completed the quiz")
                                    tableRow += `<td style="background-color: orange ;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                                } else if (progress < (qzAmount - 1)) {
                                    console.log("User has barely completed the quiz, therefore is an imcomplete")
                                    tableRow += `<td style="background-color: red ;">Incomplete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`
                                }
                                $('#studentViewResulttable tbody').append(tableRow + '</tr>')
                            }
                        })

                        //* check answers
                        console.log(snapshot.val().questions[1].answer)
                    })
                }
                // append new info to modal
                $('#teachingsuite_classviewbystudent-authed').append(html)
                    // show modal
                $('#studentInfoModal').modal('show');

            } else {
                alert("error")
            }
        })
    },
    /**==============================================
     **              PDF
     *?  What does it do? Creates PDF of user results
     *@param name type  
     *@param _studentName string  
     *@param _studentId string  
     *@return none type
     *=============================================**/
    pdf: function(_studentName, _studentID) {
        // get todays date for report
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        // display in NZ format
        today = dd + '/' + mm + '/' + yyyy;
        // get result table
        myTable = document.getElementById("studentViewResulttable");
        // clone table just incase it has illegal characters (i.e svgs)
        myClone = myTable.cloneNode(true);
        // set new id
        myClone.id = 'studentResultExport'
            // don't show user
        myClone.style = 'display: none;'
            // add it to the HTML body
        document.body.appendChild(myClone);
        // get rid of buttons 
        $('#studentResultExport #remindStudentButton').replaceWith("");
        //*create new jspdf
        var doc = new jspdf.jsPDF()
            //*doc.autotable module
        doc.autoTable({
                // get table contents from studentResultExport
                html: '#studentResultExport',
                startY: 30,
                // set theme to grid
                theme: 'grid',
                styles: {
                    minCellHeight: 10
                }
            }) //*create report header
            // header text
        doc.text(`Student Completion Report: ${_studentName}`, 20, 10);
        // small font size
        doc.setFontSize(9);
        // sub headers
        doc.text("Student ID: " + _studentID, 20, 15);
        doc.text("Generated on " + today, 20, 20);

        // footer text
        doc.text(`QuizPoint`, 10, 280);

        //? this is here as a place holder
        //* save pdf to user.
        doc.save(`studentreport_${_studentID}-${yyyy}.pdf`)
    }
}