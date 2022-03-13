/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
ts.viewstudent = {
    loadInformation: function(_studentUID) {
        var userPath = firebase.database().ref(`${defaultPath}/users/${_studentUID}`)
        userPath.once('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
                    // fetch quiz information to show information
                    // console.log(answers)
                let html = ''
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
                for (quizID in snapshot.val().quizzes.turnedin) {
                    let tableRow = `<tr>`
                    console.log(quizID)
                    console.log(snapshot.val().quizzes.turnedin[quizID])
                    let correct = 0;
                    var userPath = firebase.database().ref(`${defaultPath}/quizzes/${quizID}`)
                    userPath.once('value', (snapshot) => {
                        console.log(snapshot.val().title)
                        let qzName = snapshot.val().title
                        let qzAmount;
                        if (snapshot.val().questions.length == null) {
                            qzAmount = 0
                        } else {
                            qzAmount = snapshot.val().questions.length
                        }
                        let printQzAmount;
                        if (qzAmount === 0) {
                            printQzAmount = 0
                        } else {
                            printQzAmount = (qzAmount - 1)
                        }

                        tableRow += `<td>${qzName}</td>`
                        var activePath = firebase.database().ref(`${defaultPath}/users/${_studentUID}/quizzes/active/${quizID}`)
                        activePath.once('value', (snapshot) => {
                            if (snapshot.val() === null) {
                                // not there
                            } else {
                                console.log(snapshot.val())
                                let progress = 0;
                                if (snapshot.val().progress == undefined) {

                                } else {
                                    progress = snapshot.val().progress

                                }
                                for (var i = 1; i < snapshot.val().length; i++) {
                                    console.log(snapshot.val()[i].answers.userInput + ' in compartive to ' + snapshot.val()[i].answers.answer)
                                    if (snapshot.val()[i].answers.userInput === snapshot.val()[i].answers.answer) {
                                        correct += 1
                                    }
                                }
                                console.log(correct)
                                tableRow += `<td>${correct}/${(printQzAmount)}</td>`
                                if (progress == (qzAmount - 1)) {
                                    console.log("This user has completed the quiz")
                                    tableRow += `<td style="background-color: lightgreen;">Complete</td>
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
                                console.log(printQzAmount)
                                $('#studentViewResulttable tbody').append(tableRow + '</tr>')
                            }
                        })

                        var userPath = firebase.database().ref(`${defaultPath}/users/${_studentUID}/quizzes/turnedin/${quizID}`)
                        userPath.once('value', (snapshot) => {
                            if (snapshot.val() === null) {
                                // not there
                            } else {
                                console.log(snapshot.val())
                                let progress = 0;
                                if (snapshot.val().progress == undefined) {

                                } else {
                                    progress = snapshot.val().progress

                                }
                                tableRow += `<td>${progress}</td>`

                                for (var i = 1; i < snapshot.val().length; i++) {
                                    console.log(snapshot.val()[i].answers.userInput + ' in compartive to ' + snapshot.val()[i].answers.answer)
                                    if (snapshot.val()[i].answers.userInput === snapshot.val()[i].answers.answer) {
                                        correct += 1
                                    }
                                }
                                console.log(correct)
                                tableRow += `<td>${correct}/${(printQzAmount)}</td>`
                                if (progress == (qzAmount - 1)) {
                                    console.log("This user has completed the quiz")
                                    tableRow += `<td style="background-color: lightgreen;">Complete</td>
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
                                console.log(printQzAmount)
                                $('#studentViewResulttable tbody').append(tableRow + '</tr>')
                            }
                        })

                        //* check answers
                        console.log(snapshot.val().questions[1].answer)
                    })
                }
                $('#teachingsuite_classviewbystudent-authed').append(html)
                $('#studentInfoModal').modal('show');

            } else {
                alert("error")
            }
        })
    },
    pdf: function(_studentName, _studentID) {
        // generate new jspdf
        myTable = document.getElementById("studentViewResulttable");
        myClone = myTable.cloneNode(true);
        myClone.id = 'studentResultExport'
        myClone.style = 'display: none;'
        document.body.appendChild(myClone);
        $('#studentResultExport #remindStudentButton').replaceWith("");
        //*create new jspdf
        var doc = new jspdf.jsPDF()
            //* start pdf declare
            //*header rows

        //*doc.autotable module
        doc.autoTable({
                html: '#studentResultExport',
                startY: 30,
                theme: 'grid',
                styles: {
                    minCellHeight: 10
                }
            }) //*create report header
        const d = new Date();

        doc.text(`Report for ${_studentName} (${_studentID})`, 20, 10);
        doc.setFontSize(9);

        doc.text(`QuizPoint`, 10, 280);

        //? this is here as a place holder
        //* save pdf to user.
        doc.save(`studentreport_${_studentID}.pdf`)
    }
}