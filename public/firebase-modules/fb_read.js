/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
// let fb = {}

/**==============================================
 **              Read
 *?  Performs a read request to a database location
 *@param _path string (location)  
 *@return object
 *=============================================**/
fb.read = function(_path) {
        console.log("fb.read | Reading " + _path)
        var path = firebase.database().ref(defaultPath + '/' + _path)
        path.on('value', (snapshot) => {
            const data = snapshot.val();
            return data
        });
    }
    /**==============================================
     **              fetchQuiz
     *?  Peforms a read to the quiz location to read quiz information
     *! This is not a global function.
     *@param _qzId string  
     *@return object
     *=============================================**/
fb.fetchQuiz = function(_qzId) {
    console.log("fb.fetchQuiz | Reading quiz ID " + _qzId)
    var path = firebase.database().ref(defaultPath + '/quizzes/' + _qzId)
    path.on('value', (snapshot) => {
        const data = snapshot.val();
        return data
    });
}