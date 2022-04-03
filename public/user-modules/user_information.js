/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
let users = {}

users.information = {
    /**==============================================
     **              display
     *?  What does it do? Handles user modal displaying
     *@return type
     *@called by sidenav profile image
     *=============================================**/
    display: function() {
        console.log('users.information.display | Loading User Modal')
        this.loadUserInformation()

    },
    /**==============================================
     **              loadUserInformation
     *?  What does it do? Retrieves information from user object
     *@return n/a
     *@called user.information.display
     *=============================================**/
    loadUserInformation: function() {
        let userImage = user.picture;
        let userName = user.name
        let userStID = user.studentID
        let userRank = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        let userEmail = user.email

        let domUserInformationBody = $('#user_information-modalBody')
        let htmlToAppend = `
                    <p>Name: ${userName}</p>
                    <p>StudentID: ${userStID}</p>
                    <p>Email: ${userEmail}</p>
                    <p>Role: ${userRank}</p>
                    <p>School: ${school}</p>
        `
        domUserInformationBody.empty()
        domUserInformationBody.append(htmlToAppend)
        $('#user_information-modal').modal('show');

    }
}