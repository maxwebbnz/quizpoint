/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

$(document).ready(function() {
    fb_init()
        // $('#studentInfoModal').modal('show');
        // $("#tcs_createQuizModal").modal("show");
    window.onbeforeunload = function() {
        return "This program will restart, which will cause you to navigate back to the home page and lose all progress.";
    }

})