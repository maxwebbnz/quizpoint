/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let ts = {}
async function studentName(studentID) {
    var res = '';

    var Current_Price_Open_ref = firebase.database().ref(`${defaultPath}/users/${studentID}`)

    var snapshot = await Current_Price_Open_ref.once('value');

    if (snapshot.exists()) {
        var val = snapshot.val().name;
        res = `${val}`;

    } else {
        res = 'NA';
    }
    console.log(res)
    return res;
}
/**========================================================================
 **                           viewQuiz
 *?  What does it do? Controls the viewing of quiz by student result in TS
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
ts.viewquiz = {
    /**==============================================
     **              classList
     *?  What does it do? The brains of the viewing quiz results by student
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    classList: function(_clsid, _qzid) {
        // echo to console
        console.log('ts.viewQuiz | Viewing ' + _clsid)
            // setup current quiz array
        let currentQuizInReview = []
        let studentUIDs = []
            //* get firebase information
        var db = firebase.database().ref(`${defaultPath}/classes/${_clsid}/students/`)
        db.once('value', (snapshot) => {
            // data exist?
            if (snapshot.val() == null) {
                console.log("SORRY CLASS NO EXIST!")
                    // the logic starts here
            } else {
                // classObject is used in a for(in) later
                for (a in snapshot.val()) {
                    studentUIDs.push(a)
                }
                console.log(studentUIDs)
                let classObject = snapshot.val()
                console.log(classObject)
                    // need to load the quiz information for displaying title and knowing how many questions are there
                var l = firebase.database().ref(defaultPath + '/quizzes/' + _qzid);
                l.once('value', (snapshot) => {
                        if (snapshot.val() == null) {
                            // break
                        } else {
                            // add current quiz to the array created eariler
                            currentQuizInReview.push(snapshot.val())
                            console.log(currentQuizInReview)
                                // create head content for table
                            let thead = '<tr>'
                            let headerContent = ''
                                // add quiz title to header
                            headerContent += `Viewing Quiz: ${snapshot.val().title}`
                            $('#classGradeView-header').html(headerContent)
                            thead += `<th>Name</th>`
                                // we don't want 0 displayed...
                            for (var i = 0; i < currentQuizInReview[0].questions.length; i++) {
                                if (i == 0) {

                                } else {
                                    thead += `<th>${i}</th>`
                                }


                            }
                            // status (colour)
                            thead += `<th style="width: 50%;">Status</th></tr>`
                            $('#viewQuizResultTable thead').append(thead)

                        }

                    })
                    // for all students in class object.
                for (var i = 0; i < studentUIDs.length; i++) {
                    let a = studentUIDs[i]
                        // let a be all values in students path (which in fact is just an uid)
                    console.log(a)

                    // html content for row
                    let htmls = '';

                    // for adding on at the end
                    let htmlsEnd = '';
                    // start table row
                    // htmls = `<tr id='${a}'>`
                    // get student information for displaying name

                    // read quiz in user path
                    var l = firebase.database().ref(defaultPath + '/users/' + a + '/quizzes/active/' + _qzid);
                    l.once('value', (snapshot) => {

                        // data exist?
                        if (snapshot.val() === null) {
                            console.log("NO DATA")
                        } else {
                            // if user has no progress, they should have nothing right so therefore they don't need any ticks
                            if (snapshot.val().progress == 0) {
                                for (var i = 0; i < currentQuizInReview[0].questions.length; i++) {
                                    htmls += `<td scope="row">${"Max Webb"}</td>`

                                    // display ticks
                                    htmls += `                        <td>
${i}                        </td>`
                                }
                                // add to html
                                $('#viewQuizResultTable tbody').append(htmls)

                            } else {


                                for (var i = 0; i < currentQuizInReview[0].questions.length; i++) {
                                    if (snapshot.val().progress < currentQuizInReview[0].questions.length) {
                                        if (typeof snapshot.val().answers[i] !== 'undefined') { console.log('The user has completed question ' + i) } else {
                                            if (i === 0) {

                                            } else {
                                                console.log("USer has not done " + i)
                                                htmlsEnd += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question} Answer: No Answer" class="bi bi-x-lg"></i>
                        </td>`
                                                    // htmls.concat(htmlsEnd, "</tr>");

                                            }
                                        }
                                    }


                                }
                                for (var i = 0; i < snapshot.val().answers.length; i++) {
                                    let tableHeader = `<th>${i}</th>`
                                    $('viewQuizResultTable').append(tableHeader)
                                    let a = snapshot.val().answers
                                    let k = a[i]
                                    if (i == 0) {

                                    } else {
                                        if (typeof a[i] === 'undefined') {
                                            console.log('undefined')
                                            htmls += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="We cannot show you information" class="bi bi-x-lg"></i>
                        </td>`
                                        } else {
                                            console.log(k.userInput)
                                            if (k.userInput === k.answer) {
                                                k.correct = true;
                                                htmls += `<td id="tick">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question}? User Answer: ${k.userInput}" class="bi bi-check"></i>
                        </td>`

                                            } else {
                                                k.correct = false;
                                                htmls += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question}? User Answer: ${k.userInput}" class="bi bi-x-lg"></i>
                        </td>`
                                            }
                                            console.log(k)
                                        }
                                    }

                                }

                            }
                            let lengt = currentQuizInReview[0].questions.length
                            htmls += htmlsEnd
                            console.log(snapshot.val().progress + ' in compartive to ' + (lengt - 1))
                            if (snapshot.val().progress == (lengt - 1)) {
                                console.log("This user has completed the quiz")
                                htmls += `<td style="background-color: lightgreen;">Complete</td>
`
                            } else if (snapshot.val().progress == Math.round((lengt - 1) / 2)) {
                                console.log("This user has nearly completed the quiz")
                                htmls += `<td style="background-color: orange ; width:50%;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                            } else if (snapshot.val().progress == 1) {
                                console.log("User has barely completed the quiz")
                                htmls += `<td style="background-color: orange ;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                            } else if (snapshot.val().progress < (lengt - 1)) {
                                console.log("User has barely completed the quiz, therefore is an imcomplete")
                                htmls += `<td style="background-color: red ;">Incomplete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`
                            }


                            studentName(a).then((name) => {
                                let tr = '<tr>'
                                let htmlName = `<td scope='row'></td>`
                                console.log(htmls)

                                let htmlContentToAppend = `<tr id="${a}"><td>${name}</td>${htmls}</tr>`
                                    // htmls += htmlName
                                console.log(htmlContentToAppend)
                                $(`#viewQuizResultTable tbody`).append(htmlContentToAppend)
                                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                                var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                                    return new bootstrap.Tooltip(tooltipTriggerEl)
                                })
                            })




                        }

                    });
                    // htmls = `<tr id='${a}'>`
                    // read quiz in user path
                    var l = firebase.database().ref(defaultPath + '/users/' + a + '/quizzes/turnedin/' + _qzid);
                    l.once('value', (snapshot) => {
                        console.log(a)
                            // data exist?
                        if (snapshot.val() === null) {
                            console.log("NO DATA")
                        } else {
                            // if user has no progress, they should have nothing right so therefore they don't need any ticks
                            if (snapshot.val().progress == 0) {
                                for (var i = 0; i < currentQuizInReview[0].questions.length; i++) {
                                    htmls += `<td scope="row">${"Max Webb"}</td>`

                                    // display ticks
                                    htmls += `                        <td>
${i}                        </td>`
                                }
                                // add to html
                                $('#viewQuizResultTable tbody').append(htmls)

                            } else {


                                for (var i = 0; i < currentQuizInReview[0].questions.length; i++) {
                                    if (snapshot.val().progress < currentQuizInReview[0].questions.length) {
                                        if (typeof snapshot.val().answers[i] !== 'undefined') { console.log('The user has completed question ' + i) } else {
                                            if (i === 0) {

                                            } else {
                                                console.log("USer has not done " + i)
                                                htmlsEnd += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question} Answer: No Answer" class="bi bi-x-lg"></i>
                        </td>`
                                                    // htmls.concat(htmlsEnd, "</tr>");

                                            }
                                        }
                                    }


                                }
                                for (var i = 0; i < snapshot.val().answers.length; i++) {
                                    let tableHeader = `<th>${i}</th>`
                                    $('viewQuizResultTable').append(tableHeader)
                                    let a = snapshot.val().answers
                                    let k = a[i]
                                    if (i == 0) {

                                    } else {
                                        if (typeof a[i] === 'undefined') {
                                            console.log('undefined')
                                            htmls += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="We cannot show you information" class="bi bi-x-lg"></i>
                        </td>`
                                        } else {
                                            console.log(k.userInput)
                                            if (k.userInput === k.answer) {
                                                k.correct = true;
                                                htmls += `<td id="tick">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question}? User Answer: ${k.userInput}" class="bi bi-check"></i>
                        </td>`

                                            } else {
                                                k.correct = false;
                                                htmls += `                        <td id="cross">
                            <i data-bs-toggle="tooltip" data-bs-placement="top" title="Question: ${currentQuizInReview[0].questions[i].question}? User Answer: ${k.userInput}" class="bi bi-x-lg"></i>
                        </td>`
                                            }
                                            console.log(k)
                                        }
                                    }

                                }

                            }
                            let lengt = currentQuizInReview[0].questions.length
                            htmls += htmlsEnd
                            console.log(snapshot.val().progress + ' in compartive to ' + (lengt - 1))
                            if (snapshot.val().progress == (lengt - 1)) {
                                console.log("This user has completed the quiz")
                                htmls += `<td style="background-color: lightgreen;">Complete</td>
`
                            } else if (snapshot.val().progress == Math.round((lengt - 1) / 2)) {
                                console.log("This user has nearly completed the quiz")
                                htmls += `<td style="background-color: orange ; width:50%;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                            } else if (snapshot.val().progress == 1) {
                                console.log("User has barely completed the quiz")
                                htmls += `<td style="background-color: orange ;">Not Complete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`

                            } else if (snapshot.val().progress < (lengt - 1)) {
                                console.log("User has barely completed the quiz, therefore is an imcomplete")
                                htmls += `<td style="background-color: red ;">Incomplete <button type="button" name="" id="remindStudentButton" class="btn btn-primary"><i class="bi bi-bell"></i> Remind Student</button></td>`
                            }

                            studentName(a).then((name) => {
                                let tr = '<tr>'
                                let htmlName = `<td scope='row'></td>`
                                console.log(htmls)
                                let htmlContentToAppend = `<tr id='${a}'><td>${name}</td>${htmls}</tr>`
                                    // htmls += htmlName
                                console.log(htmlContentToAppend)
                                $(`#viewQuizResultTable tbody`).append(htmlContentToAppend)
                                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                                var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                                    return new bootstrap.Tooltip(tooltipTriggerEl)
                                })
                            })



                        }

                    });


                }


                // console.log(studentsInClass)
            }
        })

    },
    /**======================
     *!  (Depreciated)
     ** result
     *@param name type  
     *@return type
     *========================**/
    result: function(_studentObject, _quiz) {
        console.log(_studentObject)
        let answers = []
        var userPath = firebase.database().ref(`${defaultPath}/users/${_studentObject.uid}/quizzes/active/${_quiz}`)
        userPath.once('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
                answers.push(snapshot.val().answers)
                    // fetch quiz information to show information
                console.log(answers)
            } else {
                alert("error")
            }
        })

    },
    /**========================================================================
     **                           ExportTableToExcel
     *?  What does it do? Exports a table from the dom to an html element.
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
    exportTableToExcel: function() {
        myTable = document.getElementById("viewQuizResultTable");
        myClone = myTable.cloneNode(true);
        myClone.id = 'excelTable'
        myClone.style = 'display: none;'
        document.body.appendChild(myClone);
        $('#excelTable #tick').replaceWith("<td>Yes</td>");
        $('#excelTable #cross').replaceWith("<td>No</td>");
        $('#excelTable #cross').replaceWith("<td>No</td>");
        let fileName = prompt("What do you want to call this excel file?", "report")
            // Acquire Data (reference to the HTML table)
        var table_elt = document.getElementById("excelTable");

        // Extract Data (create a workbook object from the table)
        var workbook = XLSX.utils.table_to_book(table_elt);

        // Process Data (add a new row)
        var ws = workbook.Sheets["Sheet1"];
        XLSX.utils.sheet_add_aoa(ws, [
            ["QuizPoint - Created " + new Date().toISOString()]
        ], { origin: -1 });

        // Package and Release Data (`writeFile` tries to write and save an XLSB file)
        XLSX.writeFile(workbook, `${fileName}.xlsb`);
    },
    /**========================================================================
     **                           ExportTabletoPDF
     *?  What does it do? Exporting HTML Table to a pdf 
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
    exportTableToPDF: function() {
        myTable = document.getElementById("viewQuizResultTable");
        myClone = myTable.cloneNode(true);
        myClone.id = 'excelTable'
        myClone.style = 'display: none;'
        document.body.appendChild(myClone);
        $('#excelTable #tick').replaceWith("<td>Yes</td>");
        $('#excelTable #cross').replaceWith("<td>No</td>");
        $('#excelTable #remindStudentButton').replaceWith("");
        //*create new jspdf
        var doc = new jspdf.jsPDF()
            //* start pdf declare
            //*header rows

        //*doc.autotable module
        doc.autoTable({
                html: '#excelTable',
                startY: 30,
                theme: 'grid',
                styles: {
                    minCellHeight: 10
                }
            }) //*create report header
        const d = new Date();

        doc.text("Report - Results for Health and Safety Pt 1 in 9PTEC", 20, 10);
        doc.setFontSize(9);

        doc.text(`QuizPoint`, 10, 280);

        //? this is here as a place holder
        let reportName = 'resultsforhealthandsafety_9PTEC'
            //* save pdf to user.
        doc.save(`report_${reportName}.pdf`)
    },
}