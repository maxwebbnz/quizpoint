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
let currentClassId;

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