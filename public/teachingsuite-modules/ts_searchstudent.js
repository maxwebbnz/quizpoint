/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
//* Search Student Module *\\
ts.searchstudent = {
    /**==============================================
     **              Perform Search
     *?  Performs logical methods to search through user array
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    performSearch: function() {
        // declerations
        let users = []
        let inputVal = $('#tcs_filterField')
        let bool = false
            // on input change
        $("#tcs_filterField").on("input", function() {
            // empty search result div
            $('#searchResults').empty()

            if (!bool) {
                // get all users in school path
                var db = firebase.database().ref(`${defaultPath}/users/`)
                db.once('value', (snapshot) => {
                        if (snapshot.val() == null) {

                        } else {
                            // for each user, push to array
                            snapshot.forEach(function(childNodes) {
                                users.push(childNodes.val())
                            })
                            console.log(users)

                        }
                    })
                    // don't read user path again
                bool = true;
            }
            // search input value
            let val = $('#tcs_filterField').val()
                // search obj for name matches
            let obj = users.find(o => o.name === val);
            // search for objid
            let objId = users.find(o => o.studentID === val);
            // if obj doesn't exist
            if (obj === undefined) {

            } else {
                // setup html
                let html = `<div class="searchresult" data-uid="${obj.uid}" id="${obj.uid}">
                <div class="username" >
                    <p><b>${obj.name}</b></p>
                </div>
            </div>`
                    // add result
                $('#searchResults').append(html)
                    // listen for a click on box
                $(`#${obj.uid}`).on("click", function() {
                    // load user modal
                    ts.viewstudent.loadInformation(this.dataset.uid)
                });
            }
            // if objID doesn't exist
            if (objId === undefined) {

            } else {
                // setup html

                let html = `<div class="searchresult" data-uid="${objId.uid}" id="${objId.uid}">
                <div class="username" >
                    <p><b>${objId.name}</b></p>
                </div>
            </div>`
                    // add result

                $('#searchResults').append(html)
                    // listen for a click on box

                $(`#${objId.uid}`).on("click", function() {
                    // load user modal
                    ts.viewstudent.loadInformation(this.dataset.uid)
                });
            }
        });


    }
}