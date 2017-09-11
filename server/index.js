const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const port =  process.env.PORT || 3000;
const watsonAuthService = require('./watson-auth-service');


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTION');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser());

app.use(express.static(path.resolve(__dirname,'../','dist')));

server.listen(port, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined, function() {
  console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/auth', function(req, res, next) {
  watsonAuthService.getAuthToken().then((token,err)=>res.json({token}));
});
