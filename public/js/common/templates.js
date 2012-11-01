
function Templates(app) {
    
    var templates = this
    var urlRoot = app ? '/applications/' + app : ''
    urlRoot +=  '/features/'
    
    this.render = function(feature, template, data) {
        var result;
        try {
            var fn = templates.createRender(feature, template)
            result = fn(data || {})
            
            if(!(app)) {
            	var fn = new Function(template.js)
				fn()
            }
        }
        catch (er) {
            result = '<pre style="color: red;">' + er.toString() + '</pre>'
        }
        return result
    }
    
    this.createRender = function(feature, template) {
        var existingApp = Templates.currentApp
        var existingFeature = Templates.currentFeature
        try {
            Templates.currentApp = templates
            Templates.currentFeature = templates[feature]
            return Templates.jadeEngine.compile(template /*, options*/)        
        }
        finally {
            if(existingApp) {
                Templates.currentApp = existingApp
            } else {
                delete Templates.currentApp
            }
            if(existingFeature) {
                Templates.currentFeature = existingFeature
            } else {
                delete Templates.currentFeature
            }
            delete Templates.currentFeature
        }
    
    }
    
    this.makeTemplate = function(template) {
        var feature = template.feature
         ,  jadeFn = templates.createRender(feature, template.jade /*, options*/)
         ,  fn = new Function('template', 'templates', 'refs',
            template.js + '\n//@ sourceURL=' + feature + '/' + template.name + '.js')

        template.init = function(result, refs) {
            fn(result, templates, refs)
        }
        template.render = jadeFn
        template.activate = function(result) {

            var subTemplates = result.find('*[template]')

            var refs = {}
            subTemplates.each(function(i, each) {
                var each = $(each)
                 ,  eachFeature = each.attr('feature')
                 ,  eachTemplate = each.attr('template')
                if(!refs[eachFeature]) { refs[eachFeature] = {} }
                if(!refs[eachFeature][eachTemplate]) { 
                    refs[eachFeature][eachTemplate] = []
                    refs[eachFeature][eachTemplate].template = 
                        templates[each.attr('feature')][each.attr('template')]
                }
                refs[eachFeature][eachTemplate].push(each)
            })
         
            var fkeys = Object.keys(refs)
            fkeys.forEach(function(fkey){
                var f = refs[fkey]
                var tkeys = Object.keys(f)
                tkeys.forEach(function(tkey){
                    var ts = f[tkey]
                    ts.forEach(function(each){
                        ts.template.init(each, refs)
                    })
                })
            })

            template.init(result, refs)
        }
        template.create = function(data) {
            var result = $(jadeFn(data || {}))
            result.attr('feature', feature)
            result.attr('template', template.name)
            
            template.activate(result)

            return result
        } 
    }

    var doLoadTemplate = function(template) {
        var feature = template.feature
        if(!templates[feature]) { templates[feature] = {} }
        
        try {    
            templates.makeTemplate(template)
        }
        catch(er) {
            if(!(template.tries)) { template.tries = 0 }
            template.tries++
            if(template.tries < 10) {
                return template                  
            } else {
                console.log('unable to compile template',
                    template.feature, template.name, ':\n\n',
                    er.toString()) 
            }
        }

        templates[feature][template.name] = template
        
        if(!(app)) {
            $('head').append('<style>' + template.css + '</style>');
        }

    }
    
    
    var batchTemplateLoad = function(templates) {
        var template
        while((template = templates.shift()) !== undefined) {
            var retry = doLoadTemplate (template)
            if(retry) {
                templates.push(retry) 
            } 
        }        
    }
    
    var prepTemplates = function(feature, templates, toLoad) {
        if(!toLoad) { toLoad = [] }
        templates.forEach(function(template) {
            template.feature = feature
            toLoad.push(template)
        })
        return toLoad
    }
    
    this.loadAll = function(cb) {
        $.getJSON(urlRoot +  'all', function(response) {
            var templates = []
            response.features.forEach(function(feature) {
                templates = prepTemplates(feature.name, feature.templates, templates)  
            })
            batchTemplateLoad(templates)
            cb()
        })        
    }
    
    
    this.loadFeature = function(feature, cb) {
        $.getJSON(urlRoot +  feature + '/templates', function(response) {
            var templates = prepTemplates(feature, response.templates)
            batchTemplateLoad(templates)
            cb()
        })
    }
    
    this.loadTemplate = function(feature, templateName, cb) {
        $.getJSON(urlRoot + feature + '/templates/' + templateName, function(template) {
            template.feature = feature
            doLoadTemplate(template)
            cb()
        })
    }
}
Templates.jadeEngine = window.jade //jade_require('jade')
var appTemplates = {}
Templates.getApp = function(app) {
    if(!appTemplates[app]) {
        appTemplates[app] = new Templates(app)
    }
    return appTemplates[app]
}
