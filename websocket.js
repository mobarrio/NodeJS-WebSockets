// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
 
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
var clients = [ ];
var webSocketsServerIP = "10.80.71.208";
var webSocketsServerPort = 1337;
 
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getDate(){
    return dateFormat((new Date()), "yyyy-mm-dd h:MM:ss");
}

function arrayObjectIndexOf(myArray, searchTerm) {
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].socket._peername.port === searchTerm) return i;
    }
    return -1;
}

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var dateFormat = require('dateformat');

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log(getDate() + " Websocket is listening on port " + webSocketsServerPort);
});
 
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server,
    keepalive: true,
    keepaliveInterval: 20000
});
 
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin); 
    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;
    var idx = arrayObjectIndexOf(clients, connection.socket._peername.port);
    console.log(getDate() + ' Connection from origin ' + request.origin + ' ['+connection.socket._peername.port+']' + ' accepted.');

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text

            if(message.utf8Data === 'getClients'){
                connection.sendUTF(JSON.stringify( { clients: clients.length} ));
            }else{
                var obj = {
                    time: (new Date()).getTime(),
                    type:'message',
                    text: htmlEntities(message.utf8Data),
                    peerport: connection.socket._peername.port
                };
                history.push(obj);
                history = history.slice(-100);

                var json = JSON.stringify(obj);
                // broadcast message to all connected clients
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    // user disconnected
    connection.on('close', function(reasonCode, description) {
        var idx = arrayObjectIndexOf(clients, connection.socket._peername.port);
        clients.splice(idx, 1); // Se carga la coneccion del cliente que se desconecta.
        console.log(getDate() + ' Peer ' + connection.remoteAddress + ' ['+connection.socket._peername.port+']' + ' disconnected.');
    });
 
});

var express     = require('express'), 
    querystring = require('querystring'),
    path        = require('path'),
    request     = require('request'),
    fs          = require('fs'),
    http        = require('http');
var port = process.env.PORT || 80;
var app = express();

app.set('title', 'NodeJS Test');
app.use('/', express.static(__dirname + "/"));
app.use(express.logger());
// app.use(app.router);
// app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function(req, res){
    fs.readFile(__dirname + '/websocket.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/mysql2mdb/usuarios', function(req, res){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : '...',
      user     : '...',
      password : '...',
      database : '...'
    });

    connection.connect();
    connection.query('SELECT * FROM TB_Usuarios;', function(err, rows, fields) {
        var bEmpty = true;
        if (err) throw err;

        var mongodb = require('mongodb');
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        var dbTest = new mongodb.Db('TIADM', server, {})
        dbTest.open(function (error, client) {
            if (error) throw error;

            var collection = dbTest.collection('usuarios');
            collection.insert(rows, {w:1},  function(err, result) {});
       
            //disparamos un query buscando la persona que habiamos insertado por consola
            collection.find({'idUsuario': 'xx240'}).toArray(function(err, docs) {
                //imprimimos en la consola el resultado
                console.dir(docs);
            });
        });
    });
    connection.end();
});

app.get('/user/get/:idUsuario', function(req, res){
    var idUsuario = req.params.idUsuario;

    var mongodb = require('mongodb');
    var server = new mongodb.Server("127.0.0.1", 27017, {});
    var dbTest = new mongodb.Db('TIADM', server, {safe:false})
    dbTest.open(function (error, client) {
        if (error) throw error;

        var collection = dbTest.collection('usuarios');
        collection.find({'idUsuario': idUsuario}).toArray(function(err, docs) {
            res.send('Registro : ', docs);
            dbTest.close();
        });
    });
});


app.get('/user/:idUsuario', function(req, res){
    var idUsuario = req.params.idUsuario;

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : '...',
      user     : '...',
      password : '...',
      database : '...'
    });

    connection.connect();
    connection.query('SELECT * FROM TB_Usuarios;', function(err, rows, fields) {
        var bEmpty = true;
        if (err) throw err;
        for (var i=0; i < rows.length; i++) {
            if(rows[i].idUsuario === idUsuario){
                res.send('Registro : ', rows[i].Descripcion);
                
                bEmpty = false;
            };
        }
        if(bEmpty) res.send('Registro : Inexistente.');
    });
    connection.end();
});


app.get('/twitter', function(req, res){
    var express = require('express').createServer();
    var twitter = require('ntwitter');

    var twit = new twitter({
        consumer_key: '...',
        consumer_secret: '...',
        access_token_key: '...',
        access_token_secret: '...'
    });

    twit.stream('statuses/filter', {track: ['love', 'hate'] }, function(stream){
        stream.on('data', function(event) {
            console.log(data);
        });
    });
});


app.get('/test/:id/:p1/:p2', function(req, res){
    var data = querystring.stringify({
      id: req.params.id,
      p1: req.params.p1,
      p2: req.params.p2
    });    

    res.send(data);
});

app.listen(port, function() { 
        console.log(getDate() + " HTTP Server is listening on port " + port); 
});


/*
 npm cache clean
 npm config set proxy http://user:password@10.150.2.39:8080
 npm config set https-proxy http://user:password@10.150.2.39:8080
 npm config ls -l

 npm install dateformat
 npm install readable-stream
 npm install mine
 npm install pause
 npm install raw-body
 npm install send
 npm install fresh
 npm install merge-descriptors
 npm install restler
 npm install sys
 npm install util
 npm install connect
 npm install express
 npm install socket.io
 npm install ws
 npm install fs
 npm install mysql
 npm install jquery
 npm install nodemon -g

 TEST
 wscat -c ws://10.80.71.208:1337 -p 8

 > nodemon server.js


 nodemon: nodemon no es una librería, sino una herramienta. Se encarga de monitorizar el código de la aplicación y, 
          si cambia, reiniciar node.js. Así nos evitamos tener que estar continuamente tecleando Ctrl+C, node app.js 
          cada vez que cambiamos algo. Por comodidad la hemos instalado de forma global, pasando el parámetro -g a 
          npm para que esté accesible en el path.


*/
