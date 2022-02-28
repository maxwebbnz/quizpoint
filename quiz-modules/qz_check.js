let usrInput = "max s"

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
            let wordsCorrect = 0;
            let lcans = currentQuiz[currentQuestion].answer
            let ansToCheck = lcans.toLowerCase()
            let answerSplit = ansToCheck.split(' ')
            console.log(answerSplit)
            for (var i = 0; i < answerSplit.length; i++) {
                console.log(_a.includes(answerSplit[i]))
                if (_a.includes(answerSplit[i])) {
                    wordsCorrect = wordsCorrect + 1;
                }
            }
            if (wordsCorrect >= 1) {
                return true
            } else {
                return false
            }
        }
    }
}