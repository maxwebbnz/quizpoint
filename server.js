/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */



//*Base Declerations
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const nodemailer = require('nodemailer');
var firebase = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://quizpoint-nz-default-rtdb.firebaseio.com"
});

var db = firebase.database();

let defaultPath = '/schools/hvhs/'
let currentClassId;

/**==============================================
 **              firebase initliase
 *?  What does it do?
 *@param name type
 *@param name type
 *@return type
 *=============================================**/


//* Email Settings
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '18205mw@hvhs.school.nz',
        pass: 'hehehehe'
    }
});

// allow main application to run
app.use(express.static('public'));
// set view engine for templating
app.set('view engine', 'ejs');

//? Main Application
app.get('/', (req, res) => {
    res.send('index')
})

/**==============================================
 **              API Methods
 *?  Renders API calls
 *@param name type
 *@param name type
 *@return type
 *=============================================**/
/**======================
 **   /api/
 *@return error
 *========================**/
app.get('/api', function(req, res) {
    res.json({ error: "You do not have permisson for this." })
})

/**======================
 **   /api/path+userID
 *@return data structure in json
 *========================**/
app.get('/api/:path%:userUID', function(req, res) {
    // get variables
    path = req.params.path
    uid = req.params.userUID
        // check if role is greater than a student
    if (uid == null) {
        res.json({ error: "Incorrect auth key" })
    } else {
        // check rank
        var userPath = db.ref(defaultPath + 'users/' + uid);
        userPath.once("value", function(snapshot) {
            let userObj = snapshot.val()
                // if the uid isn't a user
            if (userObj == null) {
                res.json({ error: "Incorrect auth key, this key does not exist" })
            } else {
                // check if its a student
                if (userObj.role == 'student') {
                    // break
                    res.json({ error: 'You cannot view this as a student' })
                        // if teacher
                } else if (userObj.role == 'teacher') {
                    // read data further
                    var ref = db.ref(defaultPath + path);
                    // return as json
                    ref.once("value", function(snapshot) {
                        if (snapshot.val() == null) {
                            res.json({ error: "Data not present in path " + path })
                        } else {
                            res.json(snapshot.val())
                        }
                    });
                }
            }
        });
    }
})

/**======================
 **   /api/users/uid+localUID
 *@return data structure in json
 *========================**/
app.get('/api/users/:path%:userUID', function(req, res) {
    // get variables
    path = req.params.path
    uid = req.params.userUID
        // check if role is greater than a student
    if (uid == null) {
        res.json({ error: "Incorrect auth key" })
    } else {
        // check rank
        var userPath = db.ref(defaultPath + 'users/' + uid);
        userPath.once("value", function(snapshot) {
            let userObj = snapshot.val()
                // if the uid isn't a user
            if (userObj == null) {
                res.json({ error: "Incorrect auth key, this key does not exist" })
            } else {
                // check if its a student
                if (userObj.role == 'student') {
                    // break
                    res.json({ error: 'You cannot view this as a student' })
                        // if teacher
                } else if (userObj.role == 'teacher') {
                    // read data further
                    var ref = db.ref(defaultPath + "users/" + path);
                    // return as json
                    ref.once("value", function(snapshot) {
                        if (snapshot.val() == null) {
                            res.json({ error: "Data not present in path " + path })
                        } else {
                            res.json(snapshot.val())
                        }
                    });
                }
            }
        });
    }
})

/**======================
 **   /api/classes/uid+localUID
 *@return data structure in json
 *========================**/
app.get('/api/classes/:path%:userUID', function(req, res) {
    // get variables
    path = req.params.path
    uid = req.params.userUID
        // check if role is greater than a student
    if (uid == null) {
        res.json({ error: "Incorrect auth key" })
    } else {
        // check rank
        var userPath = db.ref(defaultPath + 'users/' + uid);
        userPath.once("value", function(snapshot) {
            let userObj = snapshot.val()
                // if the uid isn't a user
            if (userObj == null) {
                res.json({ error: "Incorrect auth key, this key does not exist (" + uid + ")" })
            } else {
                // check if its a student
                if (userObj.role == 'student') {
                    // break
                    res.json({ error: 'You cannot view this as a student' })
                        // if teacher
                } else if (userObj.role == 'teacher') {
                    // read data further
                    var ref = db.ref(defaultPath + "classes/" + path);
                    // return as json
                    ref.once("value", function(snapshot) {
                        if (snapshot.val() == null) {
                            res.json({ error: "Data not present in path " + path })
                        } else {
                            res.json(snapshot.val())
                        }
                    });
                }
            }
        });
    }
})

/**======================
 **   /api/classes/uid+localUID
 *@return data structure in json
 *========================**/
app.get('/api/quizzes/:path%:userUID', function(req, res) {
    // get variables
    path = req.params.path
    uid = req.params.userUID
        // check if role is greater than a student
    if (uid == null) {
        res.json({ error: "Incorrect auth key" })
    } else {
        // check rank
        var userPath = db.ref(defaultPath + 'users/' + uid);
        userPath.once("value", function(snapshot) {
            let userObj = snapshot.val()
                // if the uid isn't a user
            if (userObj == null) {
                res.json({ error: "Incorrect auth key, this key does not exist" })
            } else {
                // check if its a student
                if (userObj.role == 'student') {
                    // break
                    res.json({ error: 'You cannot view this as a student' })
                        // if teacher
                } else if (userObj.role == 'teacher') {
                    // read data further
                    var ref = db.ref(defaultPath + "quizzes/" + path);
                    // return as json
                    ref.once("value", function(snapshot) {
                        if (snapshot.val() == null) {
                            res.json({ error: "Data not present in path " + path })
                        } else {
                            res.json(snapshot.val())
                        }
                    });
                }
            }
        });
    }
})

/**==============================================
 **              Invite Handler
 *?  Performs invite requests for users who do not exist (yet)
 *@param req paramters
 *@param res paramters
 *=============================================**/
app.get('/invite/:classId%:teacherId', (req, res) => {
    currentClassId = req.params.classId
    res.render('templates/invite', {
        name: req.params.classId,
        teacherName: req.params.teacherId
    });

})

/**==============================================
 **              404
 *?  Renders 404 page
 *@param name type
 *@param name type
 *@return type
 *=============================================**/
app.get('*', function(req, res) {
    res.render('templates/404', { page: req })
});
// on a new user connection
io.on('connection', (socket) => {
    console.log('a user connected');
});


/**======================
 **   Listener for Connections
 *========================**/
io.on('connection', (socket) => {
    socket.on('joinClass', (msg) => {
        console.log(msg)
    });

    socket.on('emailInvite', (msgs) => {
        // fb.read(currentClassId)

        const sgMail = require('@sendgrid/mail')
        const msg = {
            to: msgs.email, // Change to your recipient
            from: "maxwebblighting@gmail.com", // Change to your verified sender
            subject: 'You have been invited to a class',
            templateId: 'd-5850f451eab84a7a8c3fb53821991715',
            dynamicTemplateData: {
                inviteURL: `localhost/invite/${msgs.classId}%${msgs.teacher}`,
                name: msgs.name,
            },
        }
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent to ' + msgs.email)
            })
            .catch((error) => {
                console.error(error)
            })



    });
    socket.on('emailReminder', (msg) => {
        console.log('Email to ' + msg)
            // fb.read(currentClassId)
        var mailOptions = {
            from: '18205mw@hvhs.school.nz',
            to: msg.email,
            subject: 'You have been invited to a class',
            html: `<h1>QuizPoint</h1>
                Hello ${msg.studentName},

                You have quizzes overdue, please complete them as soon as possible
                <a href="localhost">Go To Class point</a>

                Thanks,
                QuizPoint
            `
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    });
});

//* Final Part of the puzzel, listen for connections on port 3000
server.listen(3000, () => {
    console.log('listening on *:3000');
});