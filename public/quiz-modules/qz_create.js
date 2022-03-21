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
$('#tcs-createquiz-inputQuestion-keywords').flexdatalist();

/**========================================================================
 **                           qz_create
 *?  Handles all creating of quizzes in the teaching suite.
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/

let qz_create = {
    /**==============================================
     **              CheckForCache
     *?  What does it do? Checks the users cache for any quizzes needing to be completed.
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    checkForCache: function() {
        console.log('qz_create.checkForCache - Running')
        let dbRef = firebase.database().ref()
            // check if there are any quizzes cached in users variable
        dbRef.child(`${defaultPath}/quizzes/cache/`).child('placeholderuid').get().then((snapshot) => {
            // if there is
            if (snapshot.exists()) {
                // show warning icon
                $('#tcs_createQuiz-cachedQuizzes').show()
                    // set an onclick event for that icon.
                $('#tcs_createQuiz-cachedQuizzes').on('click', function() {
                    // show modal and give it all the cached quizzes
                    qz_create.displayCached(snapshot.val())
                })
            } else {
                // no data?
                console.log("No data available");
            }
            // if error
        }).catch((error) => {
            console.error(error);
        });
    },
    /**==============================================
     **              Display Cached
     *?  What does it do? Shows all cached quizzes to user.
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    displayCached: function(_allcached) {
        // display modal
        $("#tcs_cachedQuizModal").modal("show");
        //* log for testing reasons
        console.log(_allcached)
            // for each value in the object, use val as reference
        Object.values(_allcached).forEach(val => {
            //* log for testing purposes
            console.log(val)
                // setup html row for table
            let html = `<tr>
            <td>${val.name}</td>
            <td><a href="#" onclick="qz_create.editCachedQuiz(${val})">Edit</a></td>
            <td><a href="#" onclick="qz_create.deleteCachedQuiz(${val})">Delete</a></td>
            </tr>
            `
                // append to table
            $('#tcs_cachedQuizModal-table tbody').append(html)
        })
    },
    /**========================================================================
     **                           pullDOM
     *!                          Not in use
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
        // get all dom elements
        let inputName = document.getElementById('tcs-createquiz-inputQuestionTitle').value
        let inputMulti = document.getElementById('tcs-createquiz-checkBoxMulti').selected
        let inputImage = document.getElementById('tcs-createquiz-checkBoxImage').selected
        let inputFile = document.getElementById('tcs-createquiz-inputFile')
        let inputAns = document.getElementById('tcs-createquiz-inputQuestion-answers').value
            // count rows
        var count = $('#qz_questionTable tr').length;
        var row = document.getElementById("question"); // find row to copy
        var table = document.getElementById("qz_questionTable"); // find table to append to
        var clone = row.cloneNode(true); // copy children too

        clone.id = "question" + count; // change id or other attributes/contents
        // add spacing
        clone.style = 'margin-top: 100px'
            // update questions to firebase
        this.updateQuestions(count);
        // removes existing tag grabber
        $(clone.childNodes[9].childNodes[2]).remove()
            // reset values before appending HTML (i.e question row had values in it, we don't need to clone that over because it is a new question.)
        clone.childNodes[1].childNodes[0].value = ""
        clone.childNodes[3].childNodes[1].childNodes[1].childNodes[1].checked = false;
        clone.childNodes[3].childNodes[3].childNodes[1].childNodes[1].checked = false;
        clone.childNodes[5].childNodes[0].value = ""
        clone.childNodes[7].childNodes[0].value = ""
        $('#qz_questionTable tbody').append(clone); // add new row to end of table
        // resets flexdatalist
        $('.flexdatalist:last').flexdatalist();

    },
    /**========================================================================
     **                           Update Questions
     *?  What does it do? Updates the firebase cache
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
    updateQuestions: function(_qnum) {
        console.log("updateQuestions() " + _qnum)
            // decleartions
        let currentRow
        let actualRowID;
        // if a row already exists set reference
        if (_qnum == 2) {
            currentRow = document.getElementById('question').getElementsByTagName('td')
                // else if one has been generated
        } else {
            actualRowID = _qnum - 1
            currentRow = document.getElementById('question' + actualRowID).getElementsByTagName('td')

        }
        // let cq be current question
        // get DOM objects
        let quizTitle = currentRow[0].childNodes[0].value
        let quizInputType = [currentRow[1].childNodes[1].childNodes[1].childNodes[1].checked, currentRow[1].childNodes[3].childNodes[1].childNodes[1].checked]
        let answer = currentRow[3].childNodes[0].value
        let keywords = $(currentRow[4].childNodes[1]).flexdatalist('value')
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
        // 0 = text input, 1 = multi choice, 3 = image
        if (k == 0) {
            quizInput = 'multichoice'
        } else if (k == 1) {
            quizInput = 'image'
            quizMedia = imageMedia
        } else if (k == 2) {
            quizInput = 'lol'
        }

        // if the question number is two, we can use the id of the first input for file checking
        if (_qnum == 2) {
            // if file exists, store image
            if (document.getElementById("tcs_createquiz-inputFile").files.length !== 0) {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadImage(imageMedia, true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadImage(imageMedia, false)
                }
                // else if no file is present, dont store image
            } else {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadQuestionToCache(true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadQuestionToCache(false)
                }
            }
            // else if a row has already been created, we need to use another input value
        } else {
            // if there is a file in a newly created row, store file
            if ($(`#question${actualRowID} #tcs_createquiz-inputFile`).prop('files').length !== 0) {
                if (quizInput == 'image') {
                    // cQ.push(quizTitle, quizInput, quizMedia, 'userRequired')
                    uploadImage(imageMedia, true)
                } else {
                    // cQ.push(quizTitle, quizInput, quizMedia, answer)
                    uploadImage(imageMedia, false)
                }
                // else don't store it
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

        /**======================
         **   UploadImage
         *? What does it do? Stores images to firebase.storage
         *@param name type
         *@return type
         *========================**/
        async function uploadImage(_mediaFile) {
            // set a reference for the firebase storage
            const ref = firebase.storage().ref();
            // base decleration
            var file;
            // if it is og row, no need to access the new rows
            if (_qnum == 2) {
                file = $('#question #tcs_createquiz-inputFile').prop('files')[0];
                // else if new ones have been created, then access those
            } else {
                file = $(`#question${actualRowID} #tcs_createquiz-inputFile`).prop('files')[0];
            }
            // set name of media
            const name = `QUIZMEDIA_${_qnum}-${newQuizID}-${file.name}`;
            // set meta data
            const metadata = {
                contentType: file.type
            };
            // start task (uploading)
            const task = ref.child(name).put(file, metadata);
            // upload iamge
            task
                .then(snapshot => snapshot.ref.getDownloadURL())
                // after image is uploaded, update cache with link
                .then(url => {
                    updateCacheAfterImage(url)
                    console.log(url);
                })
                // if error, console.log it!
                .catch(console.error);
        }

        /**======================
         **   UpdateCacheAfterImage
         *? What does it do? Stores question in cache with image url
         *@param name type
         *@return type
         *========================**/
        function updateCacheAfterImage(_url, _bool) {
            // get variables for writing in question cache
            let qizName = document.getElementById('tcs_createquiz-inputName').value
            let qizDesc = document.getElementById('tcs_createquiz-inputDesc').value
                //! obsolute code
                // questionCache.push(cQ)
                //! end of obsolute code.
                // if question is image answer based
            if (_bool) {
                // checking if a new row hasn't been created
                if (_qnum == 2) {
                    // console.log('cache/placeholderuid/' + _qnum)
                    // store new question in cache
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
                        // for each keyword generated, add it to the choices path
                    for (var i = 0; i < keywords.length; i++) {
                        // console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/1/choices/', {
                            i: keywords[i]
                        })
                    }
                    // if it is not a new question
                } else {
                    // console.log(defaultPath + 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1)
                    // store to firebase
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
                    // for each keyword generated, add it to the choices path
                    for (var i = 0; i < keywords.length; i++) {
                        // console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1 + '/choices/', {
                            i: keywords[i]
                        })
                    }

                }
                // else if it does not require an image answer, store answer.
            } else {
                // repeat process from above.
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
                    for (var i = 0; i < keywords.length; i++) {
                        console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/1/choices/', {
                            [i]: keywords[i]
                        })
                    }
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
                    for (var i = 0; i < keywords.length; i++) {
                        console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1 + '/choices/', {
                            [i]: keywords[i]
                        })
                    }

                }
            }
        }
        // push to cQ array ready to push to cache.
        // testing purposes, console logging answer.

        /**======================
         **   uploadQuestionToCache
         *? What does it do? Uploads question to cache if no image is required to be uploaded
         *@param name type
         *@return type
         *========================**/
        function uploadQuestionToCache(_bool) {
            // getting input variables
            let qizName = document.getElementById('tcs_createquiz-inputName').value
            let qizDesc = document.getElementById('tcs_createquiz-inputDesc').value
                //! obsolute code
                // questionCache.push(cQ)
                //! end of obsolute code
                // console.log('cache/placeholderuid/' + _qnum - 1)
                //? This is the same process as above, without the url path. Please refer to above comments.
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
                    for (var i = 0; i < keywords.length; i++) {
                        console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/1/choices/', {
                            [i]: keywords[i]
                        })
                    }
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

                    for (var i = 0; i < keywords.length; i++) {
                        console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/1/choices/', {
                            [i]: keywords[i]
                        })
                    }
                } else {
                    fb.write('quizzes', 'cache/placeholderuid/' + newQuizID + '/questions/', {
                        [_qnum - 1]: {
                            title: quizTitle,
                            inputtype: quizInput,
                            answer: answer
                        }
                    })
                    for (var i = 0; i < keywords.length; i++) {
                        console.log("adding choice " + keywords[i])
                        fb.write('quizzes', 'quizzes/cache/placeholderuid/' + newQuizID + '/questions/' + _qnum - 1 + '/choices/', {
                            [i]: keywords[i]
                        })
                    }
                }
            }
        }
    },
    /**==============================================
     **              Save Quiz
     *?  What does it do? Saves quiz to directory
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    saveQuiz: function() {
        console.log("qz.create.saveQuiz() | Running")
            // store old quiz

        let oldQuiz;
        const dbRef = firebase.database().ref();
        dbRef.child(`${defaultPath}/quizzes/cache/${'placeholderuid'}/`).child(newQuizID).get().then((snapshot) => {
            if (snapshot.exists()) {
                oldQuiz = snapshot.val()
                fb.write('quizzes', newQuizID, oldQuiz)
                console.log("Success!")
                    // now delete cache, quiz is now complete
                firebase.database().ref(`${defaultPath}/quizzes/cache/${'placeholderuid'}/${newQuizID}`).remove()
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });




    }
}