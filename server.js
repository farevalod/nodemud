var net = require('net');
var chs = require('./chars.js');

var sockets = [];
var chars = [];

function bc(d)
{
	for(var i = 0; i < sockets.length; i++)
		sockets[i].write(d);
}
var server = net.Server(function (socket) {
	sockets.push(socket);
	var i = sockets.indexOf(socket);
	chars.push(new Object());
	chars[i].hp = 10;
	socket.write("Nota: Escribe 'name x' para setear tu nombre!\n");
	socket.on('data', 
		function(d) {
			msg = d.toString('utf8', 0, d.length - 1);
			if(msg.match(/name (\w+)/))
			{
				re = /name (\w+)/;
				target = re.exec(msg);
				var i = sockets.indexOf(socket);
				chars[i].name = target[1];
				console.log("stored name: " + chars[i].name);
			}
			else if(msg.match(/hit/))
			{
				re = /hit (\w+)/;
				target = re.exec(msg);
				var hit = false;
				for(var i = 0; i < sockets.length; i++)
				{
					if(chars[i].name != target[1]) 
						continue;
					else
					{
						bc(chars[sockets.indexOf(socket)].name + " hits " + target[1] + "!\n");
						chars[i].hp -= 3;
						if(chars[i].hp > 0)
							bc(target[1] + " has " + chars[i].hp + "hp.\n");
						else
						{
							bc(target[1] + " is dead.\n");
							sockets[i].end("You have been killed\n");
							sockets.splice(i,1);
							chars.splice(i,1);

						}
						hit = true;
					}
				}
				if(hit == false)
					socket.write("No hay nadie con ese nombre.\n");
			}
			else for(var i = 0; i<sockets.length; i++)
				if(sockets[i] != socket)
					sockets[i].write(d);
		}
	);
	socket.on('end',
		function() {
			var i = sockets.indexOf(socket);
			sockets.splice(i,1);
			chars.splice(i,1);
		}
	);

});

server.listen(8000, "66.228.40.69");
