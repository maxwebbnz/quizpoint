/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**========================================================================
 **                           DOM_ONload
 *?  What does it do? Runs events that must be triggered when the document is loaded
 *========================================================================**/
$(document).ready(function() {
    fb_init()
        // $('#studentInfoModal').modal('show');
    $("#tcs_assignQuizModal").modal("show");
    // window.onbeforeunload = function() {
    //     return "This program will restart, which will cause you to navigate back to the home page and lose all progress.";
    // }

})