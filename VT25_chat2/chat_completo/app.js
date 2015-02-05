var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler');
    routes = require('./routes');

var app = module.exports = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    nicknames = [];

server.listen(3000);

io.on('connection', function (socket) {
  socket.on('nickname', function (data, callback) {
    if (nicknames.indexOf(data) != -1) { 
      callback(false);
    } else {
      callback(true);
      nicknames.push(data);
      socket.nickname = data;
      console.log('Nicknames are ' + nicknames);
      io.sockets.emit('nicknames', nicknames);
      socket.broadcast.emit('announcement', {
        nick: 'system',
        message: data + ' conectado' 
      });
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
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    }
    console.log('Nicknames are ' + nicknames);
    socket.broadcast.emit('announcement', {
      nick: 'system',
      message: socket.nickname + ' disconnected' 
    });
    io.sockets.emit('nicknames', nicknames);
  });
});


// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));


if ('development' == app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
}

if ('production' == app.get('env')) {
  app.use(errorHandler()); 
}

// Routes

app.get('/', routes.index);

console.log("Express server listening on port %d in %s mode", server.address().port, app.get('env'));
