/*
 * Copyright (c) 2021-2022 QuizPoint
 * All rights reserved.
 */


let editorInputs;
let editorOpen = false;


/**============================================
 *               Regex's for Validation
 *=============================================**/
const textReg = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
// numReg only passes numbers, nothing else + characters
const numReg = /^\d+$/;
// designed to check for emails
const emailReg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
// this checks for white space, and a proper email address!
const nameReg = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
/**================================================================================================
 *                                         Validation Module
 *================================================================================================**/
let validate = {
    /**========================================================================
     **                           Text Validation
     *?   Checks a string with the textRegex and tests it
     *@param name type
     *@param textReg regex
     *@param _str string
     *@return bool
     *========================================================================**/
    /* This is a function that checks if the input is a string. */
    text: function(_str) {
        if (textReg.test(_str)) {
            // If string parsed through matches the nameReg-ex
            return true
                // return true
        } else {
            // else if it does not match
            return false
                // return false
        }
    },
    /**========================================================================
     **                           Name Vaildation
     *?   Checks a string with the nameRegex and tests it
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
    nameSpecfic: function(str) {
        if (nameReg.test(str)) {
            // If string parsed through matches the nameReg-ex
            return true
                // return true
        } else {
            // else if it does not match
            return false
                // return false
        }
    },
    /*
  Function Name: num
  Purpose: Vaildating numeric input
/* This is a function that checks if the input is a number. */
    num: function(str) {
        // Num vaildation
        if (numReg.test(str)) {
            // If string parsed through matches the numReg-ex
            return true
                // return true
        } else {
            // else if does not match
            return false
                // return false
        }
    },
    /*
  Function Name: email
  Purpose: Vaildating email input
  */
    email: function(str) {
        if (emailReg.test(str)) {
            return true;
        } else {
            return false
        }
    }
}