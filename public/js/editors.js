
var editors = {}
var theme = 'solarized_light' //'dawn'

editors.createSession = function(id) {
  var editor = ace.edit(id);
  var session = editor.getSession();
  session.setTabSize(2);
  session.setUseSoftTabs(false);
  return session;
}

editors.load = function(templates, template) {
	editors.templates = templates
	editors.template = template
	
	editors.loading = true
	editors.jade.setValue(template.jade || '')
	editors.css.setValue(template.css || '')
	editors.json.setValue(template.json || '')
	editors.js.setValue(template.js || '')
	editors.loading = false
	
	editors.showPreview()
}

editors.setPreviewContainer = function(container) {
	editors.previewContainer = $(container);
}

var accessCount = 0
editors.createPreviewDocument = function() {
	if(accessCount % 100 === 0) {
		var iframes = editors.previewContainer.children('iframe')
		iframes.remove()
		var iframe = $('<iframe class="preview" name="preview"></iframe>')
		editors.previewContainer.append(iframe)
		editors.previewDocument = window.frames['preview'].document
		window.frames['preview'].templates = editors.templates
		accessCount = 0
	}
	accessCount++;
	return editors.previewDocument
}

editors.showPreview = function() {
	if(editors.loading || !(editors.template)) { return; }
	
	var template = editors.template
		
	try {

		var json_string = template.json
		 ,	json = (json_string !== '') 
		 		? eval('(' + json_string + ')')
		 		: undefined
		
		if(typeof json === 'function') {
			json = json()
		} else {
			template.json = JSON.stringify(json, null, 2)
		}

		editors.templates.makeTemplate(editors.template)
		template.html = template.render(json)   
		
	} catch (e) {
		template.html = '<pre style="color: red;">' + e.toString() + '</pre>'
	}

	var styles = []
	var addedFeatures = {}
	var addStyles = function(featureName) {
		var featureToAdd = editors.templates[featureName]
		for(templateToAdd in featureToAdd) {
			var template = featureToAdd[templateToAdd]
			if(template.css && template.css.trim() !== '') {
				styles.push({
					feature: featureName
				 , 	template: template.name
				 , 	css: template.css
				})
			}
		}
		addedFeatures[featureName] = true
		if(!featureToAdd) {
			throw new Error('unexpected lack of featureToAdd for ' + featureName)
		}
		
		if(featureToAdd.currentDependencies) {
			for(dependecy in featureToAdd.currentDependencies) {
				if(!addedFeatures[dependecy]) {
					addStyles(dependecy)
				}
			}
		}
		
	}
	addStyles(editors.template.feature) 
	
	var iFrameDoc = editors.createPreviewDocument()
	iFrameDoc.open()
	
	var featureLayout = editors.templates[editors.template.feature].layout
	var appLayout = editors.templates.layout ? editors.templates.layout.layout : null
	var defaultLayout = Templates.getApp('jade-editor').editor.layout
	var layout = featureLayout || appLayout || defaultLayout
				
	iFrameDoc.write(layout.render({
		styles: styles
	 ,	html: template.html
	 ,	javascript: template.js
	 ,	feature: template.feature
	 ,	templateName: template.name
	}))

	iFrameDoc.close()		
	
}

/*
editors.updateCSS = function() {
	if(!editors.style) {
		editors.showPreview()
	}
	editors.style.text(editors.css.getValue())
}
*/

editors.createCSS = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	editor.renderer.setShowGutter(false)
	
	var session = editor.getSession()
	session.setTabSize(4)
	//session.setUseSoftTabs(true)
	
	var CssScriptMode = require("ace/mode/css").Mode
	editor.getSession().setMode(new CssScriptMode ())
	
	editors.css = session
	
	session.on('change', function() {
		if(editors.loading) return;

		editors.template.css = session.getValue()
		editors.template.changed = true
						
		var style = $(editors.previewDocument).find('head>style[feature=' + editors.template.feature + '][template=' + editors.template.name + ']')
		//need to insert if it doesn't exist
		style.html(editors.template.css)
	})
	
	return editor
}

editors.createJSON = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	editor.renderer.setShowGutter(false)
	
	var session = editor.getSession()
	session.setTabSize(2)
	//session.setUseSoftTabs(true)
	
	var JsonMode = require("ace/mode/json").Mode
	editor.getSession().setMode(new JsonMode ())
	
	editors.json = session
	
	session.on('change', function(){
		if(editors.loading) return;

		editors.template.json = session.getValue().trim()
		editors.template.changed = true	
		editors.showPreview()
	})
	
	return editor
}

editors.createJavascript = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	var session = editor.getSession()
	session.setTabSize(4)
	//session.setUseSoftTabs(true)
	
	var JavascriptMode = require("ace/mode/javascript").Mode
	session.setMode(new JavascriptMode ())
	
	editors.js = session
	
	session.on('change', function() {
		if(editors.loading) return;

		editors.template.js = session.getValue()
		editors.template.changed = true		
	})
	
	$(element).keydown(function(e){
		if(e.ctrlKey && e.which === 13) {
		    editors.showPreview()
		}
	})
	
	return editor
}


editors.createJade = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	session = editor.getSession();
	session.setTabSize(2);
	session.setUseSoftTabs(true);
		
	editors.jade = session;
	session.on('change', function(){
		if(editors.loading) return;

		editors.template.jade = session.getValue()
		editors.template.changed = true	
		editors.showPreview()
	})

	return editor;
	
	
}

