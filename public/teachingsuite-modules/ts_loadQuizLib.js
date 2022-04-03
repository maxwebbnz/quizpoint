/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**========================================================================
 *                             Modules are accessed by ts.loadQuizzes
 *========================================================================**/
ts.loadQuizes = {
    /**==============================================
     **              fetch
     *?  Gets data of quizzes
     *=============================================**/
    fetch: function() {
        console.log('ts.loadQuizes.fetch | Running')
            // get all quizzes
        let quizPath = firebase.database().ref(`${defaultPath}/quizzes/`)
        quizPath.once('value', (snapshot) => {
            // if there aren't any quiz
            if (snapshot.val() == null) {
                console.log('no quizzes')
            } else {
                console.log(snapshot.val())
                $.each(snapshot.val(), function(_quizId, _quizObj) {
                    if (_quizObj.title === undefined || _quizObj.title === null) {
                        // break, not valid
                    } else {
                        // quiz valid
                        // setup quiz card
                        let quizCard = `
                        <div class="card col-sm-6" id="quiz-${_quizId}" data-quizId='${_quizId}'>
                            <div class="card-header text-center">
                                <p>${_quizObj.title}</p>
                             </div>
                            <div class="card-body">
                                 <button class="generic-button " id="quiz-${_quizId}-assign">Assign Quiz</button>
                                 <button class="generic-button " id="quiz-${_quizId}-edit">Edit Quiz</button>
                                 <button class="generic-button " id="quiz-${_quizId}-delete">Delete Quiz</button>
                            </div>
                        </div>
                        `

                        // add to html doc
                        $('#ts_quizLibrary').append(quizCard)

                        // if the button assign is called on card
                        $(`#quiz-${_quizId}-assign`).on('click', function() {
                            console.log('clicked, assign for ' + _quizId)
                        })

                        // if the button edit is called on card
                        $(`#quiz-${_quizId}-edit`).on('click', function() {
                            console.log('clicked, edit for ' + _quizId)
                        })

                        // if the button delete is called on card
                        $(`#quiz-${_quizId}-delete`).on('click', function() {
                            console.log('clicked, delete for ' + _quizId)
                        })
                    }
                });
            }
        })

    }
}