var express = require('express'),
	app = express(),
    cors = require('cors'),
	fs = require('fs'),
	path = require('path'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {};
	
server.listen(3001,"0.0.0.0");



app.get('/demo', function(req, res){
	res.sendFile(__dirname + '/index.html');
});