//bc -- broadcast a message to everyone in the room.
//takes:
//	d: raw input
//does:
//	write to socket, with color, append prompt.
exports.bc = function(d)
{
	for(var i = 0; i < sockets.length; i++)
		if(sockets[i] != undefined)
		{
			msg = d.toString('utf8', 0, d.length);
			sockets[i].write("\r");
			sockets[i].write(msg.yellow);
			basics.pprompt(i);
		}
}

//pprompt -- produces the user's prompt, shows HP if it is not max.
//takes:
//	i: array id
//does:
//	write corresponding prompt to socket.
exports.pprompt = function(i)
{
	if((chars[i] != undefined) && (chars[i].hp != 10))
	{
		prpt = "HP: "+chars[i].hp+"/10> ";
		sockets[i].write(prpt.red);
	}
	else
		sockets[i].write("> ".red);
}

//pluralize -- returns a "s" if argument > 1.
//takes:
//	n: input
//does:
//	return "s" if n > 1.
exports.pluralize = function(n)
{
	if(n>1)
		return "s";
	else
		return "";
}

//look -- writes a list of connected people to a socket.
//takes:
//	socket: socket to output list.
//does:
//	write client list to socket.
exports.look = function(socket)
{
	for(var i = 0; i < sockets.length; i++)
	{
		if(chars[i] != undefined)
			if(chars[i].name)
				socket.write("["+chars[i].name+"]");
	}
	socket.write("\n");
	basics.pprompt(sockets.indexOf(socket));
}
