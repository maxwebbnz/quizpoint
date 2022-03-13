/*
 * Copyright (c) 2022 Max Webb
 * All rights reserved.
 */


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var fb = require("./someThings");
var nodemailer = require('nodemailer');
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

let currentClassId;
app.set('view engine', 'ejs');

//? Main Application
app.get('/', (req, res) => {
        res.send('index')
    })
    //? Main Application

app.get('/invite/:classId%:teacherId', (req, res) => {
    currentClassId = req.params.classId
    res.render('templates/invite', {
        name: req.params.classId,
        teacherName: req.params.teacherId
    });

})



io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('connection', (socket) => {
    socket.on('joinClass', (msg) => {
        console.log(msg)
        fb.read(currentClassId)
    });

    socket.on('emailInvite', (msg) => {
        console.log('Email to ' + msg)
            // fb.read(currentClassId)
        var mailOptions = {
            from: '18205mw@hvhs.school.nz',
            to: msg.email,
            subject: 'You have been invited to a class',
            html: `<h1>QuizPoint</h1>
                Hello ${msg.studentName},
                
                You have been invited to join QuizPoint, please go to the following link

                <a href="localhost/invite/${msg.classId}%${msg.teacher}">Join Class</a>

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

server.listen(3000, () => {
    console.log('listening on *:3000');
});