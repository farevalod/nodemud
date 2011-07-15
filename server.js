//server.js  -- Francisco Arévalo [farevalod@gmail.com]
net = require('net'); //Required for networking functions.
col = require('./colors.js'); //Enables '.color' string methods.
parser = require('./parse.js'); //Parser for user input.
basics = require('./basics.js'); //Basic broadcast, prompt, status and helper functions.

sockets = []; //Array with active sockets.
chars = []; //Array with active character Objects.

var server = net.Server(function (socket) { //Every time the server spawns a socket...
	sockets.push(socket);					//it adds it to the sockets array...
	var i = sockets.indexOf(socket);
	chars.push(new Object());				//and pushes a new character Object into chars array.
	chars[i].hp = 10;
	chars[i].xp = 0;
	console.log("New connection from: "+socket.remoteAddress);
	socket.write("Nota: Escribe 'name x' para setear tu nombre!\n");
	socket.write("Nota: Escribe 'help' para ver una lista de comandos\n");
	socket.write("Conectados: \n");
	basics.look(socket);	//On conecting, person gets a list of other people in the room.
	socket.on('data', 
		function(d){
			parser.parse(d,socket,sockets,chars); //Function that parses user input for commands (or chat).
		}
	);
	socket.on('end',
		function() { //Teardown functions for sockets and chars arrays.
			var i = sockets.indexOf(socket);
			delete sockets[i];
			delete chars[i];
		}
	);
});

server.listen(8000, "66.228.40.69"); //We start and bind the server to this port and IP address.
