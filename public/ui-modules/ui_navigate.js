/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let ui = {};
let currentPage = 'landingPage'
let lastPage = '';
/**========================================================================
 **                           UI Navigate
 *?  What does it do? Controls navigation across site
 *@param name type
 *@param name type
 *@return type
 *========================================================================**/
ui.navigate = {
    /**==============================================
     **              navigate.to
     *?  What does it do? Navigates to pages, and stores history page.
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    to: function(_view) {
        console.log('ui.navigate.to | Moving to ' + _view)
        lastView = currentPage
        $('#' + currentPage).fadeOut()
        $('#' + _view).fadeIn()
        currentPage = _view;
    }
}