/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

let currentCLSLookUpResult
    /**========================================================================
     **                           CLS.Lookup
     *?  What does it do? Performing summary/filter by student in class
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
cls.lookup = {
    /**==============================================
     **              students
     *?  What does it do? Return a search for students based on classiid
     *@param name type 
     *@param _clsid  
     *@return type
     *=============================================**/
    students: function(_clsid) {
        //create array for storing data in
        let usersSearched = [];
        // echo out to console
        console.log('cls.lookup.students | Performing a look up for ' + _clsid)
            //datapath
        var path = firebase.database().ref(defaultPath + '/classes/' + _clsid + '/students/')
            // perform snapshot find
        path.on('value', (snapshot) => {
            if (snapshot.val() == null) {
                return
            } else {
                const data = snapshot.val();
                console.log(data)
                    // set result to data for caching...
                currentCLSLookUpResult = data;
                // for(var i = 0; i < currentCLSLookUpResult.length; i++), this is more efficent and works for objects
                for (student in currentCLSLookUpResult) {
                    // set path
                    var path = firebase.database().ref(defaultPath)
                        // read data in users path with key of student (uid)
                    path.child("users").child(student).get().then((snapshot) => {
                        // if user is existant!
                        if (snapshot.exists()) {
                            // push to array
                            usersSearched.push(snapshot.val())
                        } else {
                            // dun dun dunnnnn
                            console.log("No data available");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                // final step 
                currentCLSLookUpResult = usersSearched
            }
        });
    }
}