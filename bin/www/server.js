var config = require('../../config');
var app    = require('../../app/app.js')(config); 

app.listen(config.APP_PORT, function(){
    console.log('App is listening on a port ' + config.APP_PORT); 
}); 

process.on('uncaughtException', function (err) {
  console.log(err);
}); 