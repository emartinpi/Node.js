var app = require('express')(),
    twitter = require('ntwitter');

app.listen(3000);

var twit = new twitter({
  consumer_key: 'RCezDItoqJcNsnJpHuZAtDHeU',
  consumer_secret: '9M0gcpCDnCaSWq5DM9k0CsPQNSM6QeF3szD9KrfUE4rIprLt3C',
  access_token_key: '195685000-SFEUXwH8bpeoFlGU5bA2pWM3LYpEFNXvRiZDAflP',
  access_token_secret: 'mY7nBnrO2G9UneC7GXYSmwh03xaQzgMVH95TlOQXDHIkw'
});

twit.stream('statuses/filter', { track: ['love', 'hate'] }, function(stream) {
  stream.on('data', function (data) {
    console.log(data.user.screen_name + ': ' + data.text);
  });
});