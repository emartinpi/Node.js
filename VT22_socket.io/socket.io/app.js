var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', function(error, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data, 'utf-8');
    });
  }).listen(3000);


console.log('Servidor funcionando en http://%s:%d/', 'localhost', server.address().port);

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  console.log('Usuario conectado');
  socket.on('disconnect', function () {
    console.log('Usuario desconectado');
  });
});