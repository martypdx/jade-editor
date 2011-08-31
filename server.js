var express = require('express');
var jade = require('jade');

var app = express.createServer(
    express.static('public')
);
app.set('view engine', 'jade');

app.get('/', function (request, response) {
    //response.render('meepbop', { layout: false });
});

var port = 80;
app.listen(port);
console.log('Jade-editor started on port ' + port);
