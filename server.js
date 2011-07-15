net = require('net');
col = require('./colors.js');
parser = require('./parse.js');
basics = require('./basics.js');

sockets = [];
chars = [];

var server = net.Server(function (socket) {
	sockets.push(socket);
	var i = sockets.indexOf(socket);
	chars.push(new Object());
	chars[i].hp = 10;
	chars[i].xp = 0;
	console.log("New connection from: "+socket.remoteAddress);
	socket.write("Nota: Escribe 'name x' para setear tu nombre!\n");
	socket.write("Nota: Escribe 'help' para ver una lista de comandos\n");
	socket.write("Conectados: ");
	basics.look(socket);
	socket.on('data', 
		function(d){
			parser.parse(d,socket,sockets,chars);
		}
	);
	socket.on('end',
		function() {
			var i = sockets.indexOf(socket);
			delete sockets[i];
			delete chars[i];
		}
	);
});

server.listen(8000, "66.228.40.69");
