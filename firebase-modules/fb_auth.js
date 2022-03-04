/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */

//? in debugging mode, localhost:port is the way to get authentication to work


let google = 'google';
let office = 'office';
let provider;
/**========================================================================
 **                           fb.auth
 *?  What does it do? Performs authentication based methods for program
 *@param name type  
 *@param name type  
 *@return type
 *========================================================================**/
fb.auth = {
    /**==============================================
     **              Login
     *?  What does it do? Logs in user with provider base
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    login: function(_provider) {
        firebase.auth().onAuthStateChanged(function(_user) {
            if (_user) {
                // user is already loggedin
                fb.auth.loadUser(_user.uid, _user)

            } else if (!_user) {
                if (_provider == google) {
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                        .then(function() {
                            provider = new firebase.auth.GoogleAuthProvider();
                            debug.handler("fb_auth | Starting Authentication process", "info")
                            return firebase.auth().signInWithPopup(provider).then(function(result) {
                                    var token = result.credential.accessToken;
                                    let fb_result = result.user;
                                    fb.auth.loadUser(result.user.uid, result.user)
                                    console.log(fb_result)
                                })
                                .catch(function(error) {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                });
                        })
                }
            }
        });
    },
    /**==============================================
     **              Load User
     *?  What does it do? Loads user for program, and also registers if needbe
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    loadUser(_uid, _userObj) {
        var db = firebase.database().ref(defaultPath + '/users/' + _uid)
        db.once('value', (snapshot) => {
            if (snapshot.val() == null) {
                let userObject = {
                        name: _userObj.displayName,
                        email: _userObj.email,
                        picture: _userObj.photoURL,
                        studentID: _userObj.email.split('@')[0],
                        role: 'student',
                        classes: {
                            notEnrolled: true
                        },
                        quizzes: {
                            active: {
                                notEnrolled: true
                            },
                            turnedin: {
                                notEnrolled: true
                            }
                        },
                    }
                    // store data to firebase
                firebase.database().ref(db).set(userObject);
                console.log("fb.loadUser | Loaded User and registered user " + user.name)

            } else {
                const userData = snapshot.val();
                user = userData;
                console.log("fb.loadUser | Loaded User " + user.name)
            }
        });
    },
    /**==============================================
     **              Logout
     *?  What does it do? Logs out user no matter there provider
     *@param name type  
     *@param name type  
     *@return type
     *=============================================**/
    logout: function() {
        firebase.auth().signOut().then(() => {
            // alert.success("You signed out!")
            location.reload();
        }).catch((error) => {
            debug.handler("auth.logout | ", error)
                // alert.warn("We couldn't log you out, please try again'")
        });
    }
}