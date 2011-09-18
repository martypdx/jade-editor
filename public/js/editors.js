
var editors = {}
var theme = 'solarized_light' //'dawn'
editors.createSession = function(id) {
  var editor = ace.edit(id);
  var session = editor.getSession();
  session.setTabSize(2);
  session.setUseSoftTabs(false);
  return session;
}

editors.setPreview = function(preview) {
	editors.preview = preview;
}

editors.jadeEngine = jade_require('jade')	

editors.showPreview = function() {
	if(!editors.preview) { return console.log('no preview set') }
	
	var err
	var json
	if(editors.json) {
		try {
			var json_string = editors.json.getValue().trim()
			json = json_string==="" ? null : eval('(' + json_string + ')');
		} catch (er) {
			err = er.toString();
		}
	}
	
	var html = 'No jade editor defined'
	if(!err && editors.jade) {
		try {
			var fn = editors.jadeEngine.compile(editors.jade.getValue() /*, options*/);
			html = fn(json);
		}
		catch (er) {
			err = er.toString()
		}
	}
	
	if(err) { html = '<pre style="color: red;">' + err + '</pre>' }
	
	var css = editors.css.getValue()
	var javascript = editors.javascript.getValue() 
	
	var writeToPreview = function() {
		editors.preview.open()
		editors.preview.write(editors.layout({
				css: css,
				html: html,
				javascript: javascript 
			}))
		editors.preview.close()		
	}
	if(!templates.layout) {
		templates.load('layout', function() {
			editors.layout = editors.jadeEngine.compile(templates.layout /*, options*/);
			writeToPreview()
		})
		templates.load('test', function() {})
	} else {
		writeToPreview()
	}
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
	session.setTabSize(2)
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
	
	editors.javascript = session
	
	session.on('change', editors.showPreview)
	
	return editor
}


editors.createJade = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	session = editor.getSession();
	session.setTabSize(2);
	session.setUseSoftTabs(true);
	
	var jade = jade_require('jade')	
	var onchange = function() {
		var result;
		try {

			result = jade.render(session.getValue())
		}
		catch (er) {
			result = '<pre style="color: red;">' + er.toString() + '</pre>'
		}
		editors.showPreview(result)
	}
	
	session.on('change', onchange)
	editors.jade = session;
	return editor;
	
	
}

