/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
$("#advance").on("click", function() {

});

$("#previous").on("click", function() {
    var $bar = $(".ProgressBar");
    if ($bar.children(".is-current").length > 0) {
        $bar.children(".is-current").removeClass("is-current").prev().removeClass("is-complete").addClass("is-current");
    } else {
        $bar.children(".is-complete").last().removeClass("is-complete").addClass("is-current");
    }
});

let qz_progress = {
    next: function() {
        var $bar = $(".ProgressBar");
        if ($bar.children(".is-current").length > 0) {
            $bar.children(".is-current").removeClass("is-current").addClass("is-complete").next().addClass("is-current");
        } else {
            $bar.children().first().addClass("is-current");
        }
        currentQuestion = currentQuestion + 1;
    },
    revert: function(_n) {
        let targetNum = _n
        if (targetNum > currentQuestion) {
            return false
        } else {
            for (var i = _n; i < currentQuestion; i++) {
                var $bar = $(".ProgressBar");
                if ($bar.children(".is-current").length > 0) {
                    $bar.children(".is-current").removeClass("is-current").prev().removeClass("is-complete").addClass("is-current");
                } else {
                    $bar.children(".is-complete").last().removeClass("is-complete").addClass("is-current");
                }
            }
            currentQuestion = targetNum;
            qz_display.nextQuestion();
        }
    }
}