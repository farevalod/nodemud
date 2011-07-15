var net = require('net');

var server = net.createServer(function (socket) {
  socket.write("Servidor eco\n");
  socket.pipe(socket);
});
server.listen(8000, "66.228.40.69");
