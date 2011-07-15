var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hola Mundo!\n');
}).listen(8000, "66.228.40.69");
console.log('Server escuchando en http://66.228.40.69:8000/');
