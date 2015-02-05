var app = require('express')(),
    twitter = require('ntwitter'),
    util = require('util'),
    server = app.listen(3000);


var io = require('socket.io')(server),
    track1 = 0,
    track2 = 0,
    total = 0,
    glbStream;


var twit = new twitter({
  consumer_key: 'RCezDItoqJcNsnJpHuZAtDHeU',
  consumer_secret: '9M0gcpCDnCaSWq5DM9k0CsPQNSM6QeF3szD9KrfUE4rIprLt3C',
  access_token_key: '195685000-SFEUXwH8bpeoFlGU5bA2pWM3LYpEFNXvRiZDAflP',
  access_token_secret: 'mY7nBnrO2G9UneC7GXYSmwh03xaQzgMVH95TlOQXDHIkw'
});

/*twit.stream('statuses/filter', { track: ['madrid', 'barcelona'] }, function(stream) {
  glbStream = stream;
  stream.on('data', function (data) {
    if (data.text) { 
      var text = data.text.toLowerCase();

      total++;
      if (text.indexOf('madrid') != -1) {
        madrid++;
        if ((madrid % 5) == 0)
            twitEmit('madrid_twit', data);
      }

      if (text.indexOf('barcelona') != -1) {
        barcelona++;
        if ((barcelona % 5) == 0)
          twitEmit('barcelona_twit', data);
      }
    }
  });
});*/


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/track', function (req, res) {
  //glbStream.destroy();
  total=0;track1=0;track2=0;

  twit.stream('statuses/filter', { track: [req.query.trk1, req.query.trk2] }, function(stream) {
    //glbStream = stream;
    stream.on('data', function (data) {
      if (data.text) {
        var text = data.text.toLowerCase();

        total++;
        if (text.indexOf(req.query.trk1) != -1) {
          track1++;
          if ((track1 % req.query.frc) == 0)
              twitEmit('track1_twit', data);
        }

        if (text.indexOf(req.query.trk2) != -1) {
          track2++;
          if ((track2 % req.query.frc) == 0)
            twitEmit('track2_twit', data);
        }
      }
    });
    res.end();
  });
});


function twitEmit (eventName, data) {
  io.sockets.emit(eventName, { 
      user: data.user.screen_name, 
      text: data.text,
      avatar: data.user.profile_image_url_https,
      percentages: {
        track1: (track1/total)*100,
        track2: (track2/total)*100
      }
  });
}