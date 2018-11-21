var express = require('express');
var html_controller = require('./controlers/html_controller');
var bodyParser = require('body-parser');
var session = require('express-session');


var app = express();

//serving static files
app.use(express.static('./assets'));
//app.use(express.static('./html'));
app.use(express.static('./js'));
app.use(express.static('./vendor'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//registering express-sessions
app.use(session({secret:'bananas'}));

//launching controllers
html_controller(app);

app.listen(3000);
console.log('server is listening to port 3000');
