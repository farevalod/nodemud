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
exports.pluralize = function(n)
{
	if(n>1)
		return "s";
	else
		return "";
}

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
