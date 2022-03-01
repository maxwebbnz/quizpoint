/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

let qz_create = {
    /**========================================================================
     **                           pullDOM
     *?  What does it do? Pulls HTML values before storing to database
     *@return n/a
     *========================================================================**/
    pullDOM: function() {

    },
    /**========================================================================
     **                           newRow
     *?  What does it do? Create a new row in table
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
    newRow: function() {
        var count = $('#qz_questionTable tr').length;
        var row = document.getElementById("question"); // find row to copy
        var table = document.getElementById("qz_questionTable"); // find table to append to
        var clone = row.cloneNode(true); // copy children too
        clone.id = "question" + count; // change id or other attributes/contents
        table.appendChild(clone); // add new row to end of table
    },
    /**========================================================================
     **                           Update Questions
     *?  What does it do?
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
    updateQuestions: function() {
        let currentRow = document.getElementById('question').getElementsByTagName('td')
            // let cq be current question
        let cQ = []
            // get DOM objects
        let quizTitle = currentRow[0].childNodes[0].value
        let quizInputType = [currentRow[1].childNodes[1].childNodes[1].childNodes[1].checked, currentRow[1].childNodes[3].childNodes[1].childNodes[1].checked, currentRow[1].childNodes[5].childNodes[1].childNodes[1].checked]
        let answer = currentRow[2].childNodes[0].value
        let keywords = currentRow[3].childNodes[0]
            // let k be a placeholder (would of been quizInputType but that wouldnt work)
        let k;
        // quizInputType was taken, this will have to do
        let quizInput
            // run for each type of quiz input (3)
        for (var i = 0; i < quizInputType.length; i++) {
            // if that input is selected, set k to that number
            if (quizInputType[i] == true) {
                k = i
            }
        }
        // 0 = text input, 1 = multi choice, 3 = image
        if (k == 0) {
            quizInput = 'textinput'
        } else if (k == 1) {
            quizInput = 'multichoice'
        } else if (k == 2) {
            quizInput = 'image'
        }
        // push to cQ array ready to save to firebase.
        cQ.push(quizTitle, quizInput, answer, keywords)
            // testing purposes, console logging answer.
        console.log(cQ)

    }
}

$('.mooo').click(function() {
    $('.mooo').not(this).prop('checked', false);
});