var express = require('express');
var app = express();
<%if(isPush){%>
var bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//To allow cross origin request
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
<%}%>
//To server static assests in root dir
app.use(express.static(__dirname));

//To server index.html page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

<%if(isPush){%>
//To receive push request from client
const webPush = require('web-push');
webPush.setGCMAPIKey(require('./manifest.json').gcm_sender_id);
app.post('/sendNotification', function(req, res) {
  setTimeout(function() {
    webPush.sendNotification(req.query.endpoint || '/sendNotification', {
      TTL: req.query.ttl || 10,
    })
    .then(function() {
      res.sendStatus(201);
    });
  }, (req.query.delay || 1) * 1000);
});
<%}%>

// Start the server.
app.listen(process.env.PORT || 3000, function() {
  console.log('Local Server : http://localhost:3000');
});


