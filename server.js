var express = require('express')
 //,  jade = require('jade')
 ,  fs = require('fs')

var app = express.createServer(
    express.static('public')
);
app.set('view engine', 'jade');


app.get('/', function (request, response) {
    //response.render('meepbop', { layout: false });
});



app.get('/templates/:name', function (request, response) {
    fs.readFile('features/templates/' + request.params.name + '.jade', function(err, data) {
        response.send(err ? { err: err } : { template: data.toString() });
    })
    
});


var port = 80;
app.listen(port);
console.log('Jade-editor started on port ' + port);