
var editors = {}
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
	
	var html = 'No editor defined'
	if(editors.jade) {
		try {
			html = editors.jadeEngine.render(editors.jade.getValue())
		}
		catch (er) {
			html = '<pre style="color: red;">' + er.toString() + '</pre>'
		}
	}
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
	editor.setTheme("ace/theme/solarized_light")
	
	editor.renderer.setShowGutter(false)
	
	var session = editor.getSession()
	session.setTabSize(4)
	//session.setUseSoftTabs(true)
	
	var CssScriptMode = require("ace/mode/css").Mode
	editor.getSession().setMode(new CssScriptMode ())
	
	editors.css = session
	
	session.on('change', editors.updateCSS)
	
	return editor
}


editors.createJade = function(element) {
	var editor = ace.edit(element);
	editor.setTheme("ace/theme/solarized_light")
	
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

