/*
 * Copyright (c) 2021 Max Webb
 * All rights reserved.
 */
/**========================================================================
 *                           Alert Module
 *========================================================================**/

let alert = {
    /**========================================================================
     **                           Warning
     *?  Gets warning information from the function, and displays it.
     *@param name type
     *@param _error string
     *@param _errorcode intger
     *@return n/a
     *========================================================================**/
    warn: function(_error, _errorcode) {
        debug.handler("alert.warn | Displayed warning with error of: " + _error, 'info')
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: _error,
        })
    },
    /**========================================================================
     **                           Error
     *?  Gets error information from a function, and displays it.
     *@param name type
     *@param _error string
     *@param _errorcode intger
     *@return n/a
     *========================================================================**/
    error: function(_error, _errorcode) {
        debug.handler("alert.error | Displayed error with error of: " + _error, 'info')
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: _error,
        })
    },
    /**========================================================================
     **                           Success
     *?  Gets success information from a function, and displays it.
     *@param name type
     *@param _info string
     *@param _errorcode intger
     *@return n/a
     *========================================================================**/
    success: function(_info, _errorcode) {
        debug.handler("alert.success | Displayed success with value of: " + _info, 'info')
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: _info,
        })
    },
    /**========================================================================
     **                           Success Authed
     *?  Gets success information from the auth function, and displays it.
     *@param name type
     *@param _info string
     *@param _errorcode intger
     *@return n/a
     *========================================================================**/
    authSuccess: function() {
        debug.handler("alert.authSuccess | User Successfully logged in, now showing success information", 'info')
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Woohoo! You logged in!',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1600
        })
    },
    /**========================================================================
     **                           Success Dismissed
     *?  Gets success information from any function, and displays it then automatically dismissed it.
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
    successDismissed: function(_info) {
        debug.handler("alert.successDismissed | Displayed success with value of: " + _info, 'info')
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success!',
            text: _info,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1600
        })
    },
    /**========================================================================
     **                           Game Finished
     *?  Handles pop up when game is finished :D
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
    gameFinished: function() {
        debug.handler("alert.gameFinished | User fiished game, handling pop up", "info")
        Swal.fire({
            title: 'Well done you finished the game!',
            text: "Want to reset your data to play again?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fb_store.resetUserData(client.uid);
                Swal.fire(
                    'Data reset!',
                    'Your data has been reset',
                    'success'
                )
            }
        })
    },
    /**========================================================================
     **                           Loading
     *?  Generates a loading alert (mostly used in auth processes)
     *========================================================================**/
    loading: function() {
        Swal.fire({
            position: 'center',
            title: 'Loading',
            showConfirmButton: false,
            timerProgressBar: false,
            timer: 100000
        })
    }
}