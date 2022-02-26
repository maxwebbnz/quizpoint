/*
 * Copyright (c) 2022 Max Webb
 * All rights reserved.
 */
const express = require('express');
const path = require('path');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const app = express();
const port = process.env.PORT || 8080;


const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
// sendFile will go here
// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use(express.static('public'))
app.use(connectLiveReload());

app.listen(port);
console.log('Server started at http://localhost:' + port);