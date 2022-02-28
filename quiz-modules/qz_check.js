/*
 * Copyright (c) 2021-2022 QuizPoint
 * All rights reserved.
 */


let qz_check = {
    checkAns: function(_a, _t) {
        if (_t == "multichoice") {
            console.log("Checking answer of " + _a)
            if (_a == currentQuiz[currentQuestion].answer) {
                return true
            } else {
                return false
            }
        } else if (_t == "textinput") {
            let lowerCaseA = _a.toLowerCase()
            let lcans = currentQuiz[currentQuestion].answer
            let ansToCheck = lcans.toLowerCase()
            let answerSplit = ansToCheck.split(' ')

            if (Array.isArray(currentQuiz[currentQuestion].keywords)) {
                console.log("Question is a keyword based")
                let keywordsCorrect = 0;
                for (var i = 0; i < currentQuiz[currentQuestion].keywords.length; i++) {
                    let kywrd = currentQuiz[currentQuestion].keywords[i]
                    console.log(kywrd)
                    if (lowerCaseA.includes(kywrd)) {
                        keywordsCorrect = wordsCorrect + 1;
                    }
                }
                if (keywordsCorrect >= currentQuiz[currentQuestion].minKeyWords) {
                    return true
                } else {
                    return false
                }
            } else {
                // console.log(answerSplit)
                let wordsCorrect = 0;
                if (wordsCorrect >= currentQuiz[currentQuestion].minKeyWords) {
                    return true
                } else {
                    return false
                }
                for (var i = 0; i < answerSplit.length; i++) {
                    console.log(lowerCaseA.includes(answerSplit[i]))
                    if (lowerCaseA.includes(answerSplit[i])) {
                        wordsCorrect = wordsCorrect + 1;
                    }
                }
            }


        }
    }
}