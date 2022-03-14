/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

//! do not need to declare
// let firebase = firebase.database;

let fb = {
    //Write user data to firebase 
    //_path = directory in firebase e.g /hvhs/users/
    //_id = id of document, e.g uid from Google Login, class id
    //_data = data being written in database e.g Name, Role, Email
    write: (_path, _id, _data) => {
        //? should include default path..
        firebase.database().ref(defaultPath + '/' + _path + '/' + _id).update(_data, writeError);

        //Error handler, prompt user with an error if something went wrong
        function writeError(error) {
            if (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Write Error',
                    showConfirmButton: true,
                })
            }
        }
    },

    //Read data from firebase consistently for updates
    readListener: (_path, _id, _functionToProcessData) => {
        let listener = firebase.database().ref(_path + '/' + _id);
        listener.on('value', (snapshot) => {
            let data = snapshot.val()
            _functionToProcessData();
        })
    },

    //Read data once from firebase 

    //! I couldnt get this working Alan? It wouldn't return data when i tried returning data to see if user exists...
    readOnce: (_path, _id) => {
        firebase.database().ref(_path + '/' + _id).once("value", readError);
        //Error handler prompt user with an error if something went wrong 
        function readError(error) {
            if (error) {
                console.log(error)

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Read Error',
                    showConfirmButton: true
                })
            }
        }
    }
}