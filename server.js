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
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});