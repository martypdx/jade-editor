var express = require('express')
 ,  fs = require('fs')
 ,  path = require('path')
 
var app = express.createServer(
    express.static(path.join(__dirname, 'public'))
 ,  express.bodyParser()
)

app.set('view engine', 'jade')


app.get('/', function (request, response) {
    //response.render('meepbop', { layout: false });
})

var templateService = require('./lib/template-service')
services = {}
var getTemplateService = function(app) {
    if(!services[app]) {
        /*
        var parentDir = path.dirname(__dirname)
        var appDir = path.join(parentDir, app)
        */
        
        //for smart-machine
        var appDir = app === 'jade-editor' ? __dirname : path.join(__dirname, app)
        
        services[app] = templateService.getApp(appDir)
    }
    return services[app]
}

app.get('/applications/:application/features', function (request, response) {
    var templates = getTemplateService(request.params.application)
    templates.listAll(function(err, data) {
        response.send(data)    
    })    
})

app.get('/applications/:application/features/:feature/templates/:template', function (request, response) {
    var templates = getTemplateService(request.params.application)
    templates.getTemplate(request.params.feature, request.params.template, function(err, template) {
        response.send(err || template)    
    }) 
})

app.get('/applications/:application/features/:feature/templates', function (request, response) {
    var templates = getTemplateService(request.params.application)
    templates.getTemplates(request.params.feature, function(err, templates) {
        response.send(err || templates )    
    }) 
})

app.post('/applications/:application/features/:feature/templates/:templateName', function (request, response) {
    var templates = getTemplateService(request.params.application)
    templates.saveTemplate(request.params.feature, request.params.templateName,
                 request.param('template'), function(err) {
                    if(err) { console.log('template save error', err) }
                    response.end()
                })
    
})


/*
var io = require('socket.io').listen(app);
//io.set('log level', 2); 
io.sockets.on('connection', function(client) {
    client.on('disconnect', function() {
        console.log('Client has connected');
    });
    client.on('message', function(event) {
        //client.json.send(jade.render(event.template, options));
        //client.send(err);
    });
    client.on('disconnect', function() {
        console.log('Client has disconnected');
    });
});
*/

var port = 80
app.listen(port)
console.log('Jade-editor started on port ' + port)