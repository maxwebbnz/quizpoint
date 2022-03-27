/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
/**========================================================================
 **                           qz_display
 *?  What does it do? For displaying quizzes to client
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
let qz_display = {
    /**==============================================
     **              start
     *?  What does it do? Starts quiz, and sets everything up
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    start: function() {
        // quickly hide things again
        $('#classpage_authed_student').hide()
        $('#qz-inputType-inputfield').hide()
        $('#viewQuiz').show()
        $("#multichoice").empty();
        //* easier to just do it manually
        var $bar = $(".ProgressBar");
        if ($bar.children(".is-current").length > 0) {
            $bar.children(".is-current").removeClass("is-current").addClass("is-complete").next().addClass("is-current");
        } else {
            $bar.children().first().addClass("is-current");
        }
        // qz_load.getQuiz
        // declare variables
        let title = $('#qz-title')
        let image = $('#qz-image')
        let input = $('#qz-input')

        // start filling out html
        // quiz question
        console.log(currentQuiz[currentQuestion])
        title.html(currentQuiz[currentQuestion].title)
            // ready to display SRC
        if (currentQuiz[currentQuestion.image] == null) {
            console.log("qz - No media to display")
        } else {
            image.src = currentQuiz[currentQuestion].attr("src", image)
        }
        // minus one due to an empty object in  array ._.
        qz_display.generateProgress(currentQuiz.length - 1, currentQuiz)
            // checking input type
        if (currentQuiz[currentQuestion].inputtype == "textinput") {
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

        } else if (currentQuiz[currentQuestion].inputtype == "multichoice") {
            // find all choices in database, and then make it that way
            let choiceArray = []

            // push choices in choiceArray
            for (var i = 0; i < currentQuiz[currentQuestion].choices.length; i++) {
                if (currentQuiz[currentQuestion].choices[i] === '' || currentQuiz[currentQuestion].choices[i] === null) {
                    return;
                } else {
                    choiceArray.push(currentQuiz[currentQuestion].choices[i])
                }
            }

            // logging for dev purposes
            console.log('mutlichoice')

            // for each choice
            for (var i = 0; i < choiceArray.length; i++) {
                // logging for dev purposes
                console.log(currentQuiz[currentQuestion].choices[i])

                // reference for time sakes
                let choice = currentQuiz[currentQuestion].choices[i]

                // extra check if the choice is null, don't add it!
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
                    $('#qz-input').show()

                    document.getElementById('multichoice').appendChild(btn);
                }
            }

        }
    },
    /**==============================================
     **              nextQuestion
     *?  What does it do? Skips to the next question
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    nextQuestion: function() {
        // quickly hide things again
        $('#qz-inputType-inputfield').hide()
        $('#qz-inputfield').val('')

        $("#multichoice").empty();
        if (currentQuiz.length < currentQuestion + 1) {
            console.log("Quiz has finished")
            qz_turnedin.quiz(currentQuizId)
            $('#qz-inputType-inputfield').hide()
            $('#viewQuiz').hide()
        } else {
            // qz_load.getQuiz
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
                    // let btn = document.createElement("button");
                    // btn.innerHTML = "Next";
                    // btn.id = "qz-btn-textinput"
                    // btn.type = "button";
                    // btn.onclick = function() {
                    //         qz_answer.ans($('#qz-inputfield').val(), "textinput")
                    //     }
                    // btn.onclick = qz_check.checkAns(choice)
                    // btn.name = "textinput";
                    // document.body.appendChild(btn);

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
                        document.getElementById('multichoice').appendChild(btn);
                    }
                }

            }
        }
    },
    /**========================================================================
     **                           Generate
     *?  What does it do? Generates progress bar steps for each question
     *@param _amount amount of questions (int)
     *@param _questionName
     *@return n/a
     *========================================================================**/
    generateProgress: function(_amount, _questions) {
        console.log("Generating progress bar...")
            // short hand expressions for variables parsed...
        let am = _amount
        let qn = _questions
        for (var i = 1; i < currentQuiz.length; i++) {
            console.log(currentQuiz[i])
            let li = document.createElement('li')
            li.className = 'ProgressBar-step'
            li.id = 'questionProgress'
            li.name = i

            let div = document.createElement('div')
                // div.className = 'icon'

            let svgs = document.createElement('svg')
            svgs.id = "questionProgress"
            svgs.onclick = function() {
                qz_progress.revert(i)
            }
            svgs.className = 'icon'
                // svgs.style = "width: 90%"


            let span = document.createElement('span')
            span.className = 'ProgressBar-stepLabel'
            span.innerHTML = i
            $('.ProgressBar').append(li)
            $(div).append(svgs)
            $(li).append(div)

            $(li).append(span)

        }
        var $bar = $(".ProgressBar");
        if ($bar.children(".is-current").length > 0) {
            $bar.children(".is-current").removeClass("is-current").addClass("is-complete").next().addClass("is-current");
        } else {
            $bar.children().first().addClass("is-current");
        }
    }
}