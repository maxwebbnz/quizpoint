/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

// for creating a cache of progress as the user creates new questions
/*
should return the following:
---
        0: (4) ['adad', 'textinput', 'ada', input]
        1: (4) ['adadsss', 'textinput', 'adass', input]
        length: 2
        [[Prototype]]: Array(0)
---
this will allow easy storing of questions from a firebase point of view (can just do a for loop over the length of the questions, and they already have an id....)
*/

let newQuizID = 'QUIZ_' + generatePushID();

let questionCache = []

/**========================================================================
 **                           qz_create
 *?  Handles all creating of quizzes in the teaching suite.
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
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
        let inputName = document.getElementById('tcs-createquiz-inputQuestionTitle').value
        let inputMulti = document.getElementById('tcs-createquiz-checkBoxMulti').selected
        let inputImage = document.getElementById('tcs-createquiz-checkBoxImage').selected
        let inputFile = document.getElementById('tcs-createquiz-inputFile')
        let inputAns = document.getElementById('tcs-createquiz-inputQuestion-answers').value

        var count = $('#qz_questionTable tr').length;
        var row = document.getElementById("question"); // find row to copy
        var table = document.getElementById("qz_questionTable"); // find table to append to
        var clone = row.cloneNode(true); // copy children too
        clone.id = "question" + count; // change id or other attributes/contents
        clone.style = 'margin-top: 100px'
        this.updateQuestions(count);
        // reset values before appending HTML (i.e question row had values in it, we don't need to clone that over because it is a new question.)
        clone.childNodes[1].childNodes[0].value = ""
        clone.childNodes[3].childNodes[1].childNodes[1].childNodes[1].checked = false;
        clone.childNodes[3].childNodes[3].childNodes[1].childNodes[1].checked = false;
        clone.childNodes[5].childNodes[0].value = ""
        table.appendChild(clone); // add new row to end of table
    },
    /**========================================================================
     **                           Update Questions
     *?  What does it do?
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
    updateQuestions: function(_qnum) {
        let currentRow
        if (_qnum == 2) {
            currentRow = document.getElementById('question').getElementsByTagName('td')
        } else {
            let actualRowID = _qnum - 1
            currentRow = document.getElementById('question' + actualRowID).getElementsByTagName('td')

        }
        // let cq be current question
        // get DOM objects
        let quizTitle = currentRow[0].childNodes[0].value
        let quizInputType = [currentRow[1].childNodes[1].childNodes[1].childNodes[1].checked, currentRow[1].childNodes[3].childNodes[1].childNodes[1].checked]
        let answer = currentRow[3].childNodes[0].value
        let imageMedia = currentRow[2].childNodes[0].files[0]
            // let keywords = currentRow[3].childNodes[0]
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
        let quizHasMedia = false;
        // 0 = text input, 1 = multi choice, 3 = image
        if (k == 0) {
            quizInput = 'multichoice'
        } else if (k == 1) {
            quizHasMedia = true;
            quizInput = 'image'
            quizMedia = imageMedia
        } else if (k == 2) {
            quizInput = 'lol'
        }
        let cQ = []

        if (quizHasMedia) {
            if (quizInput == 'image') {
                cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')

            } else {
                cQ.push(quizTitle, quizInput, quizMedia, answer)
            }

        } else {
            if (quizInput == 'image') {
                cQ.push(quizTitle, quizInput, 'userRequired')

            } else {
                cQ.push(quizTitle, quizInput, answer)
            }


        }

        // push to cQ array ready to push to cache.
        // testing purposes, console logging answer.
        console.log(cQ)
            // push to cache
        questionCache.push(cQ)
        fb.write('quizzes', 'cache/placeholderuid', {
            [newQuizID]: {
                name: "Max Webb"
            }
        })

        // then update cache of current quiz information.


    }
}

// $('.mooo').click(function() {
//     $('.mooo').not(this).prop('checked', false);
// });