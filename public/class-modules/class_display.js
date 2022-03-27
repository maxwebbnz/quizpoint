/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let quizAssigned = [];
let quicCompleted = [];
let currentClassId;
//! class won't work in js since it is taken...
let cls = {}
    /**========================================================================
     **                           CLS Display
     *?  What does it do? Handling of displaying class relevant information
     *@param name type
     *@param name type
     *@return type
     *========================================================================**/
cls.display = {
    /**==============================================
     **              Load Home
     *?  What does it do? Loads class home page
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    loadHome: function() {
        // clear html component from other classes
        $('#homePage-authed_student-class').html('')

        let clsList = []
            // check if user is enrolled in any classes
        if (user.classes.notEnrolled) {
            // echo to console
            console.log('User is not enrolled in any classess...')
                // echo to page this .append statement is the same as
                //? $('#' + currentPage).append('<p>' + user.name + ', you do not have any classes!</p>')
                // i just thought that was easier
            $('#' + currentPage).append(`<p>${user.name}, you do not have any classes!</p>`)
        } else {
            fetchData()
                // async to make it wait before moving on, it needs to await data
                // let a be class
            async function fetchData() {
                for (a in user.classes) {
                    var path = firebase.database().ref(defaultPath + '/classes/' + a)
                    path.on('value', (snapshot) => {
                        if (snapshot.val() == null) {
                            return
                        } else {
                            const data = snapshot.val();
                            // classObject = data;
                            clsList.push(data)
                            user.classes[data.code] = data
                            console.log(data)
                            cls.display.createClassCard(data)
                        }
                    });
                }
            }
        }
    },
    /**==============================================
     **              Create Class Card
     *?  What does it do? Creates class card for user
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    createClassCard: function(_classObject) {
        console.log(`cls.display.createClassCard | Creating Card for ${_classObject.className}`)
            //? html creating may be inefficent but could work a bit nicer than a lot of declearing? thoughts Alan?
            //* once again using template string
        let html = `<div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${_classObject.className}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${_classObject.classCreator}</h6>
                        <a href="#" class="card-link" id="classCard-a-${_classObject.code}" data-class="${_classObject.code}">View Class</a>
                    </div>
                    </div>`

        let newClassCardDesign = `
            <div class="card col-sm-6" style='margin-bottom: 2%;' id="classId-${_classObject.code}">
                <img id="cardBackgroundImage" class="card-img-top" src="./media/dummyClassImage.jpg" alt="Class image for on card">
                <div class="card-body">
                    <h3 class="card-title text-center">${_classObject.className}</h3>
                    <p class="card-text text-center">${_classObject.classCreator}</p>
                </div>
                    <a href="#" class="card-link text-center" id="classCard-a-${_classObject.code}" data-class="${_classObject.code}">View Class</a>
            </div>

                    `
            //* append current page (classPage) with html generated
        $('#homePage-authed_student-class').append(newClassCardDesign)
            // listen for clicks on link, if it is pressed, show class page
        $(`#classCard-a-${_classObject.code}`).on("click", function() {
            cls.display.loadClassPage(this.dataset.class)

        });

    },
    /**==============================================
     **              Load Class Page
     *?  What does it do? Loads class page with relevant information
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    loadClassPage: async function(_classId) {
        // empty out elements before starting
        quizAssigned.length = 0
        quicCompleted.length = 0
        $('#classPageHeader').empty()
            // for other functions if needbe (i.e qz_turnedin.quiz)
        currentClassId = _classId
        let classRef = user.classes[_classId]
            // echo to consle
        console.log(`cls.display.loadClassPage | Showing page information for ${_classId}`)
            // set html element up
        let html = `
            <h2 class="text-center" style="color: white;">${classRef.className}</h2>
            <h5 class="text-center" style="color: white;">Taught by ${classRef.classCreator}</h5>`
        $('#classPageHeader').append(html)
            // find active quizzes
        qz.loadActive.match(user.uid, _classId)
            // navigate to class page for student
        ui.navigate.to('classpage_authed_student')
    },
    /**==============================================
     **              FUNCTION NAME
     *?  What does it do?
     *@param name type
     *@param name type
     *@return type
     *=============================================**/
    loadQuizProgressBar: function() {
        let ctx = document.getElementById('quizProgress').getContext('2d');
        let quizData = {
            labels: [
                'Turned In',
                'Not Completed',
            ],
            datasets: [{
                data: [10, 5],
                backgroundColor: [
                    'rgb(80, 200, 120)',
                    'rgb(238, 75, 43)',
                ],
                hoverOffset: 3
            }]
        };
        let quizChart = new Chart(ctx, {
            type: 'doughnut',
            data: quizData,
        });
        quizCjart

    }
}