//parse.js  -- Francisco Arévalo [farevalod@gmail.com]
//parse -- checks user input for commands or chat.
//takes:
//	d: raw input
//	socket: output socket
//	sockets: socket array
//	chars: character array
//does:
//	match and execute commands, else format and send chat message.
exports.parse = function(d,socket,sockets,chars)
{
	msg = d.toString('utf8', 0, d.length - 1);
	if(msg.match(/^name (\w+)/)) //Name change command
	{
			re = /^name (\w+)/;
			target = re.exec(msg);
		var i = sockets.indexOf(socket);
		chars[i].name = target[1];
		console.log(chars);
		basics.bc(target[1]+" se ha conectado.\n"); //Broadcast name change.
		return;
	}			
	if(chars[sockets.indexOf(socket)]== undefined)
	{
		console.log(chars);
		return;
	}
	else if(msg.match(/^(hit|kill)/)) //Hit command
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
					atk = Math.floor(Math.random()*5) + 1; //Damage formula.
					atkstr1 = chars[sockets.indexOf(socket)].name + " golpea a " + target[2] + "!\n";
					atkstr2 = "El golpe hace "+atk+"hp"+basics.pluralize(atk)+" de daño!\n";
					basics.bc(atkstr1.red+atkstr2.red.bold); //Broadcast combat.
					chars[i].hp -= atk;
					if(chars[i].hp > 0)
					{
						basics.pprompt(i); //Update victim's hp-prompt.
					}
					else //Somebody died.
					{
						basics.bc(target[2] + " ha muerto.\n");
						sockets[i].end("Has sido eliminado!\n");
						xpstr = "Has eliminado a "+target[2]+"! Ganas 500 xp!\n";
						socket.write(xpstr.green);
						chars[sockets.indexOf(socket)].xp += 500;
						basics.pprompt(sockets.indexOf(socket));
						delete sockets[i];
						console.log(chars[i].name +" died.");
						delete chars[i];
						console.log(chars);
					}
					hit = true;
				}
			}
		}
		if(hit == false)
		{
			socket.write("No hay nadie con ese nombre.\n"); 
			basics.pprompt(sockets.indexOf(socket));
		}
	}
	else if(msg.match(/^look/)) //look or 'look person':
	{
		if(msg.match(/^look (\w+)/)) //report hp of person.
		{
			re = /^look (\w+)/;
			target = re.exec(msg)
			for(var i = 0; i<sockets.length; i++)
				if(chars[i] != undefined)
					if(chars[i].name == target[1])
						socket.write(target[1]+" tiene "+chars[i].hp+" hp"+basics.pluralize(chars[i].hp)+"\n");
			basics.pprompt(sockets.indexOf(socket));
		}
		else  //report people in the room.
			basics.look(socket);
	}
	else if(msg.match(/^help/)) //Help menu
	{
		socket.write("name x para setear tu nombre a x\n");
		socket.write("look para mostrar los jugadores conectados\n");
		socket.write("hit x (o kill x) para atacar a otro jugador\n");
		socket.write("help muestra estra pantalla\n");
		basics.pprompt(sockets.indexOf(socket));
	}
	else //Chat command
	{ 
		for(var i = 0; i<sockets.length; i++)
			if(sockets[i] == socket)
				var author = chars[i].name;
		basics.bc("<"+author+"> "+d); //We leave the trailing newline for the parser to chomp.
	}
}
