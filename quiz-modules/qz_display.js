/*
 * Copyright (c) 2022 Max Webb
 * All rights reserved.
 */

let qz_display = {
    start: function() {
        // declare variables
        let title = $('#qz-title')
        let image = $('#qz-image')
        let input = $('#qz-input')
            // start filling out html
            // quiz question
        title.html(currentQuiz[currentQuestion].question)
            // ready to display SRC
        if (currentQuiz[currentQuestion.image] == null) {
            console.log("qz - No media to display")
        } else {
            image.src = currentQuiz[currentQuestion].attr("src", image)
        }
        // checking input type
        if (currentQuiz[currentQuestion].type == "textinput") {
            // show text input
            $('#qz-inputType-inputfield').show()
            let btn = document.createElement("button");
            btn.innerHTML = "Next";
            btn.id = "qz-btn-textinput"
            btn.type = "button";
            btn.onclick = function() {
                    qz_answer.ans($('#qz-inputfield').val(), "textinput")
                }
                // btn.onclick = qz_check.checkAns(choice)
            btn.name = "textinput";
            document.body.appendChild(btn);

        } else if (currentQuiz[currentQuestion].type == "multichoice") {
            // find all choices in database, and then make it that way
            for (var i = 0; i < currentQuiz[currentQuestion].choices.length; i++) {
                console.log(currentQuiz[currentQuestion].choices[i])
                let choice = currentQuiz[currentQuestion].choices[i]
                if (choice == null) {
                    console.log("Choice " + i + " is not vaild")
                } else {
                    // it stores the name as the choice for easy answer checking later on...
                    let btn = document.createElement("button");
                    btn.innerHTML = choice;
                    btn.id = "qz-btn"
                    btn.type = "button";
                    btn.onclick = function() {
                            qz_answer.ans(choice, "multichoice")
                        }
                        // btn.onclick = qz_check.checkAns(choice)
                    btn.name = choice;
                    document.body.appendChild(btn);
                }
            }

        }
    }
}