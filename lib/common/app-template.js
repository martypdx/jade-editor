var templateService = require('./template-service')
var exportObject = {
    attach: function(app, directory) {
        
        var templates = templateService.getApp(directory)
                
        app.get('/features/all', function (request, response) {
            templates.getAll(function(err, data) {
                response.send(data)    
            })    
        })
        
        app.get('/features', function (request, response) {
            templates.listAll(function(err, data) {
                response.send(data)    
            })    
        })
                
        app.get('/features/:feature/templates/:template', function (request, response) {
            templates.getTemplate(request.params.feature, request.params.template, function(err, template) {
                response.send(err || template)    
            }) 
        })
        
        app.get('/features/:feature/templates', function (request, response) {
            templates.getTemplates(request.params.feature, function(err, templates) {
                response.send(err || templates )    
            }) 
        })
        
        app.post('/features/:feature/templates/:templateName', function (request, response) {
            templates.saveTemplate(request.params.feature, request.params.templateName,
                request.param('template'), function(err) {
                   if(err) { console.log('template save error', err) }
                   response.end()
               })
        })
    }
}
module.exports = exportObject