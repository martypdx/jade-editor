var templates = {};
templates.jadeEngine = jade_require('jade')

templates.render= function(feature, template, data) {
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

templates.createRender = function(feature, template) {
    try {
        templates.currentFeature = feature
        return templates.jadeEngine.compile(template /*, options*/)        
    }
    finally {
        delete templates.currentFeature
    }

}

templates.load = function(feature, name, cb) {
    
    templates.loadFeature('/features/' + feature +  '/templates', cb)   
}

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

templates.loadFeature = function(feature, cb) {
    $.getJSON('/features/' + feature +  '/templates', function(response) {
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

templates.loadTemplate = function(feature, template, cb) {
    $.getJSON('/features/' + feature +  '/templates/' + template, function(response) {
        doLoadTemplate(feature, response)
        cb()
    })
}