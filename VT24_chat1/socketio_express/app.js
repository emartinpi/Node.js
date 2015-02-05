var express = require('express'),
	app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

server.listen(3000);


//app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function (socket) {
  socket.emit('bienvenida', { text: 'ESTAS CONECTADO' });
});