var app = require('express')(),
    twitter = require('ntwitter');
    
var server = app.listen(3000),
    io = require('socket.io')(server);

var twit = new twitter({
  consumer_key: 'RCezDItoqJcNsnJpHuZAtDHeU',
  consumer_secret: '9M0gcpCDnCaSWq5DM9k0CsPQNSM6QeF3szD9KrfUE4rIprLt3C',
  access_token_key: '195685000-SFEUXwH8bpeoFlGU5bA2pWM3LYpEFNXvRiZDAflP',
  access_token_secret: 'mY7nBnrO2G9UneC7GXYSmwh03xaQzgMVH95TlOQXDHIkw'
});

twit.stream('statuses/filter', { track: ['love'] }, function(stream) {
  stream.on('data', function (data) {
    io.sockets.emit('tweet', {
      user: data.user.screen_name,
      text: data.text
    });
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});