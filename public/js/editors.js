
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
	
	var err
	var json_string, json
	if(editors.json) {
		try {
			json_string = editors.json.getValue().trim()
			json = (json_string === '') ? null : eval('(' + json_string + ')');
			if(typeof json === 'function') { json = json()}
		} catch (er) {
			err = er.toString();
		}
	}
	
	var js = editors.js.getValue()
	
	var jade = editors.jade.getValue()
	var html
	if(err) {
		html = '<pre style="color: red;">' + err + '</pre>'
	} else if(editors.jade) {
		var design = '_design_' + editors.template.name
		json = json || {}
		json[design] = true
		
		try {
			var jadeFn = editors.template.render = editors.templates.createRender(editors.template.feature, jade)
			editors.template.fn = editors.template.render.toString()
			html = editors.template.render(json)
			var fn = new Function('template', js)
			editors.template.create = function(data) {
				var result = $(jadeFn(data))
				fn(result)
				return result
			}   
		}
		catch (er) {
			html = '<pre style="color: red;">' + er.toString() + '</pre>'
		}

		delete json[design]

	} else {
		html = 'No jade editor defined'
	}
	
	
	
	var css = editors.css.getValue()
	
	if(editors.template) {
		//var dmp = new diff_match_patch();
		//var diff = {}
		function update(part, value) {
			var previous = editors.template[part] || ''
			 ,	current = value || ''
			if (previous !== current) {
				//diff[part] =  dmp.diff_main(previous, current)
				editors.template[part] = value
				editors.template.changed = true
			}		
		}
		
		update('css', css)
		update('html', html)
		update('jade', jade)
		update('js', js)
		update('json', json_string)

		//div.innerHTML = dmp.diff_prettyHtml(d);

	}
	
	var styles = []
	var addedFeatures = {}
	var addStyles = function(featureName) {
		var featureToAdd = editors.templates[featureName]
		for(templateToAdd in featureToAdd) {
			var templateCss = featureToAdd[templateToAdd].css
			if(templateCss && templateCss.trim() !== '') {
				styles.push(templateCss)
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
			css: styles,
			html: html,
			javascript: js 
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
	
	session.on('change', editors.showPreview)
	
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
	
	session.on('change', editors.showPreview)
	
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
	
	session.on('change', editors.showPreview)
	
	return editor
}


editors.createJade = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	session = editor.getSession();
	session.setTabSize(2);
	session.setUseSoftTabs(true);
		
	session.on('change', editors.showPreview)
	editors.jade = session;
	return editor;
	
	
}

