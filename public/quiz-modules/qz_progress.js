/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**======================
 **   Listener for click events
 *========================**/
$("#previous").on("click", function() {
    var $bar = $(".ProgressBar");
    if ($bar.children(".is-current").length > 0) {
        $bar.children(".is-current").removeClass("is-current").prev().removeClass("is-complete").addClass("is-current");
    } else {
        $bar.children(".is-complete").last().removeClass("is-complete").addClass("is-current");
    }
});

/**========================================================================
 **                           qz_progress
 *?  Handles progress bar on quiz page
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
let qz_progress = {
    /**==============================================
     **              Next
     *?  Moves along the progress bar
     *@return type
     *=============================================**/
    next: function() {
        // get element using jq
        var $bar = $(".ProgressBar");
        // check, then add one
        if ($bar.children(".is-current").length > 0) {
            $bar.children(".is-current").removeClass("is-current").addClass("is-complete").next().addClass("is-current");
        } else {
            $bar.children().first().addClass("is-current");
        }
        // increminet question #
        currentQuestion = currentQuestion + 1;
    },
    /**==============================================
     **              Revert
     *?  Moves back to another question
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    revert: function(_n) {
        // setup variables
        let targetNum = _n
            // check if it is a invaild request
        if (targetNum > currentQuestion) {
            return false
        } else {
            // remove dot until it reaches the current question
            for (var i = _n; i < currentQuestion; i++) {
                var $bar = $(".ProgressBar");
                if ($bar.children(".is-current").length > 0) {
                    $bar.children(".is-current").removeClass("is-current").prev().removeClass("is-complete").addClass("is-current");
                } else {
                    $bar.children(".is-complete").last().removeClass("is-complete").addClass("is-current");
                }
            }
            // reset current question
            currentQuestion = targetNum;
            //display new quiz information
            qz_display.nextQuestion();
        }
    }
}