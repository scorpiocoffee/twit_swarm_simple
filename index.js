'use strict';

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var errorhandler = require('errorhandler');
var server = require('http').createServer(app);
var io = require('socket.io')(http);
var socket = io.listen(server);
var twitter = require('twit');
var hotwords = require('./api/words_parse');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(path.normalize(__dirname + '/'), 'client')));
app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

server.listen(3000, function() {
   console.log('Express server listening on %d, in %s mode', 3000, app.get('env'));
});

