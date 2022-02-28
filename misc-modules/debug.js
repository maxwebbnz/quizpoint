/*
 * Copyright (c) 2021 Max Webb
 * All rights reserved.
 */
/**========================================================================
 *                           Debug Module
 *             For handling debug messages/output to console
 *========================================================================**/
let debugOn = true;
let debug = {
    /**========================================================================
     **                           Debug Handler
     *?  Checks if debugging mode is enabled.
     *@param name type  
     *@return n/a
     *========================================================================**/
    handler: function(_message, _type) {
        if (debugOn == false) {
            return
        }
        if (_type == 'info') {
            console.info(_message);
        }
        if (_type == 'warn') {
            console.warn(_message);
        }
        if (_type == 'error') {
            console.error(_message);
        }
    }
}