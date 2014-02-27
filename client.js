;var WSClient = function () {
    var webSocketsServerIP = "10.80.71.208";
    var webSocketsServerPort = 1337;
    var url = 'ws://'+webSocketsServerIP+':'+webSocketsServerPort+'/';
    var WebSocketClient = require('websocket').client;
    var wsClient = new WebSocketClient({
        closeTimeout: 2000
    });

    init_socket = function(text){
        wsClient.on('connectFailed', function(error) {
            console.log('Connect Error: ' + url +' ' + error.toString());
        });

        wsClient.on('connect', function(connection) {
            connection.on('error', function(error) {
                console.log("Connection Error: " + error.toString());
            });

            if (connection.connected){
                connection.sendUTF(text);
                connection.close();
            }

        });

        wsClient.connect('ws://'+webSocketsServerIP+':'+webSocketsServerPort, 'echo-protocol');
    };

    return{
        SendMsg: function (text) {
            init_socket(text);
        }
    };
}();

WSClient.SendMsg("Hola Mundo...");