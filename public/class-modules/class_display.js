/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

/**======================
 **   start off all items in this module will start with cls
 *========================**/

//*Declerations *\\
let quizAssigned = [];
let quicCompleted = [];
let currentClassId;

let cls = {}
    /**========================================================================
     **                           CLS Display
     *?  Handles displaying student's class information in home page (includes Cards and actual class page)
     *@param name type  
     *@param name type  
     *@return type
     *========================================================================**/
cls.display = {
    /**==============================================
     **              Load Home
     *?  Loads users classes to page
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    loadHome: function() {
        // clear html component from other classes
        $('#homePage-authed_student-class').html('')
        let clsList = []
        if (user.classes.notEnrolled) {
            console.log('User is not enrolled in any classess...')
                // append to html
            $('#' + currentPage).append(`<p>${user.name}, you do not have any classes!</p>`)
        } else {
            fetchData()
            async function fetchData() {
                // a is equal to classCode
                for (a in user.classes) {
                    // read database
                    var path = firebase.database().ref(defaultPath + '/classes/' + a)
                    path.on('value', (snapshot) => {
                        if (snapshot.val() == null) {
                            return
                        } else {

                            const data = snapshot.val();
                            // push class to a list array
                            clsList.push(data)
                            user.classes[data.code] = data
                            cls.display.createClassCard(data)
                        }
                    });
                }
            }
        }
    },
    /**==============================================
     **              Create Class Card
     *?  Creates class card for home page
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    createClassCard: function(_classObject) {
        console.log(`cls.display.createClassCard | Creating Card for ${_classObject.className}`)
            // set HTML 
        let html = `<div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${_classObject.className}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${_classObject.classCreator}</h6>
                        <a href="#" class="card-link" id="classCard-a-${_classObject.code}" data-class="${_classObject.code}">View Class</a>
                    </div>
                    </div>`
            //append current page (classPage) with html generated
        $('#homePage-authed_student-class').append(html)
            // listen for clicks on link
        $(`#classCard-a-${_classObject.code}`).on("click", function() {
            // load class page
            cls.display.loadClassPage(this.dataset.class)

        });

    },
    /**==============================================
     **              Load Class Page
     *? Loads users class page
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    loadClassPage: async function(_classId) {
        // empty out page
        quizAssigned.length = 0
        quicCompleted.length = 0
        $('#classPageHeader').empty()
        currentClassId = _classId
            // a reference to the class id(e.g classRef = a2819)
        let classRef = user.classes[_classId]
        console.log(`cls.display.loadClassPage | Showing page information for ${_classId}`)
            // set html element up
        let html = `<h2>${classRef.className}</h2>
        <h5>Taught by ${classRef.classCreator}`
        $('#classPageHeader').append(html)
            // find active quizzes
        qz.loadActive.match(user.uid, _classId)
            // navigate to class page for student
        ui.navigate.to('classpage_authed_student')
    }
}