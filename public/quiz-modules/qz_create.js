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
let quizHasMedia = false;
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
        console.log("updateQuestions() " + _qnum)
        let currentRow
        let actualRowID;

        if (_qnum == 2) {
            currentRow = document.getElementById('question').getElementsByTagName('td')
        } else {
            actualRowID = _qnum - 1
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
        quizHasMedia = true;
        // 0 = text input, 1 = multi choice, 3 = image
        if (k == 0) {
            quizInput = 'multichoice'
        } else if (k == 1) {
            quizInput = 'image'
            quizMedia = imageMedia
        } else if (k == 2) {
            quizInput = 'lol'
        }
        let cQ = []

        if (_qnum == 2) {
            if (document.getElementById("tcs_createquiz-inputFile").files.length !== 0) {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadImage(imageMedia)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadImage(imageMedia)
                }
            } else {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadQuestionToCache(true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadQuestionToCache(false)
                }
            }
        } else {
            console.log(_qnum + " actualRowID")
            if ($(`#question${actualRowID} #tcs_createquiz-inputFile`).prop('files').length !== 0) {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadImage(imageMedia, true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadImage(imageMedia, false)
                }
            } else {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadQuestionToCache(true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadQuestionToCache(false)
                }
            }
        }
        async function uploadImage(_mediaFile) {
            const ref = firebase.storage().ref();
            var file;
            if (_qnum == 2) {
                file = $('#question #tcs_createquiz-inputFile').prop('files')[0];
            } else {
                file = $(`#question${actualRowID} #tcs_createquiz-inputFile`).prop('files')[0];
            }
            const name = `QUIZMEDIA_${_qnum}-${newQuizID}-${file.name}`;
            const metadata = {
                contentType: file.type
            };
            const task = ref.child(name).put(file, metadata);
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                    updateCacheAfterImage(url)
                    console.log(url);
                })
                .catch(console.error);
        }

        function updateCacheAfterImage(_url, _bool) {
            let qizName = document.getElementById('tcs_createquiz-inputName').value
            let qizDesc = document.getElementById('tcs_createquiz-inputDesc').value
            questionCache.push(cQ)
            if (_bool) {
                if (_qnum == 2) {
                    console.log('cache/placeholderuid/' + _qnum)
                    fb.write('quizzes', 'cache/placeholderuid', {
                        [newQuizID]: {
                            name: qizName,
                            description: qizDesc,
                            questions: {
                                [1]: {
                                    title: quizTitle,
                                    inputtype: quizInput,
                                    media: _url,
                                    answer: 'userRequired'
                                }
                            }

                        }
                    })
                } else {
                    console.log(defaultPath + 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1)
                    firebase.database().ref(defaultPath + 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1).update({
                        title: quizTitle,
                        inputtype: quizInput,
                        media: _url,
                        answer: 'userRequired'
                    }, (error) => {
                        if (error) {
                            console.log(error)
                        } else {

                        }
                    });

                }
            } else {
                if (_qnum == 2) {
                    console.log('cache/placeholderuid/' + _qnum)
                    fb.write('quizzes', 'cache/placeholderuid', {
                        [newQuizID]: {
                            name: qizName,
                            description: qizDesc,
                            questions: {
                                [1]: {
                                    title: quizTitle,
                                    inputtype: quizInput,
                                    media: _url,
                                    answer: answer
                                }
                            }

                        }
                    })
                } else {
                    console.log(newQuizID)
                    console.log(actualRowID)
                    console.log(defaultPath + 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + actualRowID)
                    firebase.database().ref(defaultPath + 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + actualRowID).update({
                        title: quizTitle,
                        inputtype: quizInput,
                        media: _url,
                        answer: answer
                    }, (error) => {
                        if (error) {
                            console.log(error)
                        } else {

                        }
                    });

                }
            }
        }
        // push to cQ array ready to push to cache.
        // testing purposes, console logging answer.
        function uploadQuestionToCache(_bool) {
            let qizName = document.getElementById('tcs_createquiz-inputName').value
            let qizDesc = document.getElementById('tcs_createquiz-inputDesc').value
            questionCache.push(cQ)
            console.log('cache/placeholderuid/' + _qnum - 1)
            if (_bool) {
                if (_qnum == 2) {
                    console.log('cache/placeholderuid/' + _qnum)
                    fb.write('quizzes', 'cache/placeholderuid', {
                        [newQuizID]: {
                            name: qizName,
                            description: qizDesc,
                            questions: {
                                [1]: {
                                    title: quizTitle,
                                    inputtype: quizInput,
                                    answer: 'userRequired'
                                }
                            }

                        }
                    })
                } else {
                    fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/', {
                        [_qnum - 1]: {
                            title: quizTitle,
                            inputtype: quizInput,
                            answer: 'userRequired'
                        }
                    })
                }
            } else {
                if (_qnum == 2) {
                    console.log('cache/placeholderuid/' + _qnum)
                    fb.write('quizzes', 'cache/placeholderuid', {
                        [newQuizID]: {
                            name: qizName,
                            description: qizDesc,
                            questions: {
                                [1]: {
                                    title: quizTitle,
                                    inputtype: quizInput,
                                    answer: answer
                                }
                            }

                        }
                    })
                } else {
                    fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/', {
                        [_qnum - 1]: {
                            title: quizTitle,
                            inputtype: quizInput,
                            answer: answer
                        }
                    })
                }
            }
        }
        // push to cache
        // get other html elements for caching


        // then update cache of current quiz information.


    }
}

// $('.mooo').click(function() {
//     $('.mooo').not(this).prop('checked', false);
// });