
var editors = {}
var theme = 'dawn'
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
			html = editors.jadeEngine.render(editors.jade.getValue(), {locals: json} )
		}
		catch (er) {
			err = er.toString()
		}
	}
	
	if(err) { html = '<pre style="color: red;">' + err + '</pre>' }
	editors.preview.open()
	editors.preview.write(html)
	
	if(editors.css) {
		editors.head = $(editors.preview.getElementsByTagName('head'))
		editors.style = $('<style type="text/css"></style>')
		editors.head.append(editors.style)
		editors.updateCSS()
	}

	editors.preview.close()
}

editors.updateCSS = function() {
	if(!editors.style) {
		console.log('showing preview in order to have style')
		editors.showPreview()
	}
	
	editors.style.html(editors.css.getValue())
}


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
	
	session.on('change', editors.updateCSS)
	
	return editor
}

editors.createJSON = function(element) {
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	//editor.renderer.setShowGutter(false)
	
	var session = editor.getSession()
	session.setTabSize(2)
	//session.setUseSoftTabs(true)
	
	var JsonScriptMode = require("ace/mode/json").Mode
	editor.getSession().setMode(new JsonScriptMode ())
	
	editors.json = session
	
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

