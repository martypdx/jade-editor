var intervalId, posting
var loadEditor = function(feature, templateName) {
    if(intervalId) { clearInterval(intervalId) }
    
    var templates = Templates.getApp(currentApp)
    var template = templates[feature][templateName]
    editors.load(templates, template)
    
    intervalId = setInterval(function() {
        if(posting || !editors.template.changed){ return }
        
        posting = true
        donePosting = function() { posting = false}
        
        try {
            var templateParts = ['css', 'fn', 'html', 'jade', 'js', 'json']
            var toPost = {}
            templateParts.forEach(function(part){
                toPost[part] = editors.template[part]
            })
            
            var post = $.post('/applications/' + currentApp + '/features/' + feature +  '/templates/' + template.name, { template: toPost })
            
            post.error(function() { console.log('error')})
            post.complete(function() {
                posting = false		
            })
                                    
        }
        catch (er) {
            console.log(er)
        }
        

        editors.template.changed = false
        
    }, 1500)				
}

var loadTemplate = function(feature, template) {		
    var loadIt = function() { loadEditor(feature, template) }
    
    var templates = Templates.getApp(currentApp)
    
    if(!templates[feature]) {
        templates.loadFeature(feature, loadIt)				
    } else if (!templates[feature][template]) {
        templates.loadTemplate(feature, template, loadIt)
    } else {
        loadIt()
    }
}
var newTemplate = function(feature, template) {		
    var templates = Templates.getApp(currentApp)
    templates.loadTemplate(feature, template, function() {
        loadEditor(feature, template) })
}

var init = function() {
    var editorTemplates = Templates.getApp('jade-editor')
    
    var featureList
    var loadFeatureList = function() {
        if(!editorTemplates['template-selector'] || !featureList) { return }

        var template = editorTemplates['template-selector']['feature-list']
        var css = $('<style></style>')
        css.text(template.css)
        $('head').append(css)
        
        var html= template.render(featureList)
        $('#side-panel').append(html)
        var fn = new Function(template.js)
        fn()
    }
    
    editorTemplates.loadAll(loadFeatureList)
    $.getJSON('/applications/' + currentApp + '/features', function(response) {
        featureList = response
        loadFeatureList()
        
        var templates = Templates.getApp(currentApp)
        templates.loadAll(function() {
            var toLoad = {  }
            if (featureList.features.length > 0) {
                toLoad.feature = featureList.features[0].name
                if (featureList.features[0].templates.length > 0) {
                    toLoad.template = featureList.features[0].templates[0]
                    loadTemplate(toLoad.feature, toLoad.template)
                }
            }
        })   
    })
    
    var $panes = $('#master')
    var panes = Panes.init($panes, { widthRatio: .1, subOptions: { widthRation: .61 }})
    
    editors.setPreviewContainer($panes.find('#preview-container')[0]); 
    
    var jade_editor = editors.createJade($panes.find('.jade')[0])
    var css_editor = editors.createCSS($panes.find('.css')[0])
    var json_editor = editors.createJSON($panes.find('.json')[0])
    var javascript_editor = editors.createJavascript($panes.find('.javascript')[0])
    
    editors.showPreview()
            
    panes.onresize(function() {
        jade_editor.resize()
        css_editor.resize()
        json_editor.resize()
        javascript_editor.resize()
    })
    
    
    
}

$(init)

/*
window.onblur = function() {
    suspendResize = true
}

window.onfocus = function() {
    suspendResize = false
}
*/