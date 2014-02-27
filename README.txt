WebSockets
==========

Prueba de NodeJS y WebSockets


- Software necesarios
	nodejs
	mongodb

- Modulos necesarios
	npm install nodemon -g
	npm install mysql
	npm install mongodb
	npm install express
	npm install websocket
	npm install http
	npm install dateformat
	npm install querystring
	npm install path
	npm install request
	npm install fs
	npm install send
	npm install util
	npm install socket.io

- Para arrancar el ejemplo
	- Con libreria websocket
	C:\Users\xx240\nodejskoans>nodemon websocker.js

	- Con libreria socket.io
	C:\Users\xx240\nodejskoans>nodemon socketio.js

- Pagina de inicio y websockets
	http://10.80.71.208

Nota: Las siguientes funcionalidades solo se pueden probar con el servidor de websocket.js

- Busqueda de un usuario en MongoDB
	http://10.80.71.208/user/get/10899

- Busqueda de un usuario en MySQL
	http://10.80.71.208/user/10899

- Test de Parametros
	http://10.80.71.208/test/idXXXX/Param1/Param2

- Test de WebSockets desde linea de comando
	C:\Users\xx240\nodejskoans>node client.js


Notas: La opcion de install -g es que instala el modulo de forma global y esto permite utilizarlo desde la consola como un comando.