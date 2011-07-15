var net = require('net');

var sockets = [];
var chars = [];

function bc(d)
{
	for(var i = 0; i < sockets.length; i++)
		if(sockets[i] != undefined)
			sockets[i].write(d);
}

function pluralize(n)
{
	if(n>1)
		return "s";
	else
		return "";
}

function look(socket)
{
	for(var i = 0; i < sockets.length; i++)
	{
		if(chars[i] != undefined)
			if(chars[i].name)
				socket.write("["+chars[i].name+"] \n");
	}
}

var server = net.Server(function (socket) {
	sockets.push(socket);
	var i = sockets.indexOf(socket);
	chars.push(new Object());
	chars[i].hp = 10;
	console.log(chars);
	socket.write("Conectados: ");
	for(var i = 0; i < sockets.length; i++)
	{
		if(chars[i] != undefined)
			if(chars[i].name)
				socket.write("["+chars[i].name+"] ");
	}
	socket.write("\n");
	socket.write("Nota: Escribe 'name x' para setear tu nombre!\n");
	socket.write("Nota: Escribe 'help' para una lista de comandos\n");
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
				bc(target[1]+" has connected.\n");
				return;
			}			
			if(chars[sockets.indexOf(socket)]== undefined)
			{
				console.log(chars);
				return;
			}
			else if(msg.match(/hit/))
			{
				re = /hit (\w+)/;
				target = re.exec(msg);
				var hit = false;
				for(var i = 0; i < sockets.length; i++)
				{
					if(chars[i] != undefined)
					{
						if(chars[i].name != target[1]) 
							continue;
						else
						{
							bc(chars[sockets.indexOf(socket)].name + " hits " + target[1] + "!\n");
							atk = Math.floor(Math.random()*5) + 1;
							bc("He hits for "+atk+"hp"+pluralize(atk)+"\n");
							chars[i].hp -= atk;
							if(chars[i].hp > 0)
								bc(target[1] + " has " + chars[i].hp + "hp"+pluralize(chars[i].hp)+"\n");
							else
							{
								bc(target[1] + " is dead.\n");
								sockets[i].end("You have been killed\n");
								delete sockets[i];
								delete chars[i];
							}
							hit = true;
						}
					}
				}
				if(hit == false)
					socket.write("No hay nadie con ese nombre.\n");
			}
			else if(msg.match(/look/))
			{
				look(socket);
			}
			else if(msg.match(/help/))
			{
				socket.write("name x para setear tu nombre a x\n");
				socket.write("look para mostrar los jugadores conectados\n");
				socket.write("hit x para atacar a otro jugador\n");
				socket.write("help muestra estra pantalla\n\n");
			}
			else
			{ 
				for(var i = 0; i<sockets.length; i++)
					if(sockets[i] == socket)
						var author = chars[i].name;
				for(var i = 0; i<sockets.length; i++)
					if(sockets[i] != undefined)
						sockets[i].write("<"+author+"> "+d);
			}
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
