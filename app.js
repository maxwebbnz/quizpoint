/*
 * Copyright (c) 2022 Max Webb
 * All rights reserved.
 */

// references.
const express = require('express');
const path = require('path');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const app = express();
const port = process.env.PORT || 8080;

// live reload, you shouldn't need to touch this
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// get stuff, this works fine for our current layout..
app.get('/', function(req, res) {
    // req could be used to parse information through URL?
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
// include all static files in public directory
app.use(express.static('public'))
    // use the livereload method.
app.use(connectLiveReload());
// listen to connections on port (8080s)
app.listen(port);
console.log('Safety360 is running. Accessible on: http://localhost:' + port + " | Presss CTRL + C to exit process.");