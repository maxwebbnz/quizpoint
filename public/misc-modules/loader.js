/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let loader = {}

/**==============================================
 **              loader.Display
 *?  What does it do? Displays loading ui
 *@return type
 *@calledby Logging in, data intensive functions, etc.
 *=============================================**/
loader.display = function() {
    console.log('loader.display | Showing loader')
    $('.loadingDialog').fadeIn()
}

loader.exit = function() {
    console.log('loader.display | Hiding loader')
    $('.loadingDialog').fadeOut()
}