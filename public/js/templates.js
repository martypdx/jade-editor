
function Templates(app) {
    
    var templates = this
    var urlRoot = '/applications/' + app +  '/features/'
    
    this.render = function(feature, template, data) {
        var result;
        try {
            var fn = templates.createRender(feature, template)
            result = fn(data)
        }
        catch (er) {
            result = '<pre style="color: red;">' + er.toString() + '</pre>'
        }
        return result
    }
    
    this.createRender = function(feature, template) {
        try {
            Templates.currentFeature = templates[feature]
            return Templates.jadeEngine.compile(template /*, options*/)        
        }
        finally {
            delete Templates.currentFeature
        }
    
    }
    
    /*
    this.load = function(feature, name, cb) {
        
        templates.loadFeature(urlRoot +  'templates', cb)   
    }
    */
    
    var doLoadTemplate = function(feature, template) {
        try {
            template.feature = feature
            //if(!(template.fn) || template.fn === "") {  
               template.render = templates.createRender(feature, template.jade /*, options*/)
               template.fn = template.render.toString()
            //} else {
            //   template.render = new Function(template.fn)
            //}
            if(!templates[feature]) { templates[feature] = {} }
            templates[feature][template.name] = template
       }
       catch(er) {
           if(!(template.tries)) { template.tries = 0 }
           template.tries++
           if(template.tries < 3) {
               return template                  
           } else {
               console.log('load template error', er) 
           }
       } 
    }
    
    this.loadFeature = function(feature, cb) {
        $.getJSON(urlRoot +  feature + '/templates', function(response) {
            templates[response.name] = {}
            var template
            while((template = response.templates.shift()) !== undefined) {
                var retry = doLoadTemplate (response.name, template)
                if(retry) {
                    response.templates.push(retry) 
                }
            }
            cb()
        })
    }
    
    this.loadTemplate = function(feature, template, cb) {
        $.getJSON(urlRoot + feature + '/templates/' + template, function(response) {
            doLoadTemplate(feature, response)
            cb()
        })
    }
}
Templates.jadeEngine = jade_require('jade')
var appTemplates = {}
Templates.getApp = function(app) {
    if(!appTemplates[app]) {
        appTemplates[app] = new Templates(app)
    }
    return appTemplates[app]
}


