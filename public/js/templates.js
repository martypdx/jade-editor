var templates = {};
templates.load = function(name, cb) {
    var loader = this;        
    $.getJSON('/templates/' + name, function(response) {
        loader[name] = response.template;
        cb();
    });
};