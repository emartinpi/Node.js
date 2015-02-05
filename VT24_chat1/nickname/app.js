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
  socket.on('nickname', function (data) {
    nicknames.push(data);
    socket.nickname = data;
    console.log('Nicknames are ' + nicknames);
  });
  socket.on('disconnect', function () {
    if (!socket.nickname) return;
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    }
    console.log('Nicknames are ' + nicknames);
  });
});
