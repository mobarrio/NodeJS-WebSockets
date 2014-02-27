"use strict";
var clients = [ ];
var webSocketsServerIP = "10.80.71.208";
var webSocketsServerPort = 1338;
var port = process.env.PORT || 80;
var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');
var dateFormat = require('dateformat');
var server = app.listen(port, function() {
   console.log("Express server listening on port " + port);
});
var io = require('socket.io').listen(webSocketsServerPort, { log: false }, function() {
   console.log("Socket.IO is listening on port " + webSocketsServerPort);
});

app.configure(function(){
	app.use(express.favicon());
	app.use(express.logger('dev'));
});
io.set('log level', 1);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/socketio.html');
});

io.sockets.on('connection', function (socket) {
 	var address = socket.handshake.address;
    var client_ip = address.address;
    clients.push(socket);
    console.log('Connection from origin ' + client_ip + ' ['+address.port+']' + ' accepted.');
	console.log("  Enviando mensaje de READY al cliente.");
	socket.emit('ready', {text: 'Cliente esta listo para ser utilizado.'});	
	console.log("  Enviando mensaje de BIENVENIDA al cliente.");
	io.sockets.emit('message', {text: 'Bienvenido al Websocket '+address.address+' on Port '+address.port+' Conectado.'});

	socket.on('disconnect', function () {
        var idx = arrayObjectIndexOf(clients, socket.id);
        clients.splice(idx, 1); // Se carga la coneccion del cliente que se desconecta.
		console.log("Client Disconect.");
		io.sockets.emit('message', {text: 'Client disconected  '+socket.handshake.address.address});
	});
});

function arrayObjectIndexOf(myArray, searchTerm) {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].id === searchTerm) return i;
    }
    return -1;
}

function getDate(){
    return dateFormat((new Date()), "yyyy-mm-dd h:MM:ss");
}
