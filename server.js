var net = require('net');

var sockets = [];
var chars = [];

function bc(d)
{
	for(var i = 0; i < sockets.length; i++)
		if(sockets[i] != undefined)
		{
			sockets[i].write("\r");
			sockets[i].write(d);
			sockets[i].write("\n$ ");
		}
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
				socket.write("["+chars[i].name+"]");
	}
	socket.write("\n$ ");
}

function parse(d,socket)
{
	msg = d.toString('utf8', 0, d.length - 1);
	if(msg.match(/^name (\w+)/))
	{
			re = /^name (\w+)/;
			target = re.exec(msg);
		var i = sockets.indexOf(socket);
		chars[i].name = target[1];
		console.log(chars);
		bc(target[1]+" has connected.");
		return;
	}			
	if(chars[sockets.indexOf(socket)]== undefined)
	{
		console.log(chars);
		return;
	}
	else if(msg.match(/^(hit|kill)/))
	{
		re = /^(hit|kill) (\w+)/;
		target = re.exec(msg);
		var hit = false;
		for(var i = 0; i < sockets.length; i++)
		{
			if(chars[i] != undefined)
			{
				if(chars[i].name != target[2]) 
					continue;
				else
				{
					atk = Math.floor(Math.random()*5) + 1;
					bc(chars[sockets.indexOf(socket)].name + " hits " + target[2] + "!\nEl golpe hace "+atk+"hp"+pluralize(atk)+" de daño!");
					chars[i].hp -= atk;
					if(chars[i].hp > 0)
					{
						sockets[i].write("HP: "+chars[i].hp+"hp"+pluralize(chars[i].hp));
						sockets[i].write("\n$ ");
					}
					else
					{
						bc(target[2] + " ha muerto.");
						sockets[i].end("Has sido eliminado!\n");
						delete sockets[i];
						delete chars[i];
					}
					hit = true;
				}
			}
		}
		if(hit == false)
			socket.write("No hay nadie con ese nombre.\n$ ");
	}
	else if(msg.match(/^look/))
	{
		if(msg.match(/^look (\w+)/))
		{
			re = /^look (\w+)/;
			target = re.exec(msg)
			for(var i = 0; i<sockets.length; i++)
				if(chars[i] != undefined)
					if(chars[i].name == target[1])
						socket.write(target[1]+" tiene "+chars[i].hp+" hp"+pluralize(chars[i].hp));
			socket.write("\n$ ");
		}
		else
			look(socket);
	}
	else if(msg.match(/^help/))
	{
		socket.write("name x para setear tu nombre a x\n");
		socket.write("look para mostrar los jugadores conectados\n");
		socket.write("hit x (o kill x) para atacar a otro jugador\n");
		socket.write("help muestra estra pantalla\n\n$ ");
	}
	else
	{ 
		for(var i = 0; i<sockets.length; i++)
			if(sockets[i] == socket)
				var author = chars[i].name;
		bc("<"+author+"> "+d);
	}
}


var server = net.Server(function (socket) {
	sockets.push(socket);
	var i = sockets.indexOf(socket);
	chars.push(new Object());
	chars[i].hp = 10;
	console.log("New connection from: "+socket.remoteAddress);
	socket.write("Nota: Escribe 'name x' para setear tu nombre!\n");
	socket.write("Nota: Escribe 'help' para ver una lista de comandos\n");
	socket.write("Conectados: ");
	look(socket);
	socket.on('data', 
		function(d){
			parse(d,socket);
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
