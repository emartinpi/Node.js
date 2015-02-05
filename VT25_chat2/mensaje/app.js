var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    nicknames = [];

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('nickname', function (data, fn) {
    if (nicknames.indexOf(data) != -1) { 
      fn(true);
    } else {
      fn(false);
      nicknames.push(data);
      socket.nickname = data;
      io.sockets.emit('nicknames', nicknames);
    }
  });
  socket.on('user message', function (data) {
    io.sockets.emit('user message', { 
      nick: socket.nickname, 
      message: data 
    });
  });
  socket.on('disconnect', function () {
    if (!socket.nickname) return;
    nicknames.splice(nicknames.indexOf(socket.nickname), 1);
  });
});
