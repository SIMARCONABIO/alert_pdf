var express    = require('express');        
var app        = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 4001; 
var index = require('./routes/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/pdf/', index);

app.listen(port);
console.log('ini port ' + port);