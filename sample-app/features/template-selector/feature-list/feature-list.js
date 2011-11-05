var templates = Templates.getApp('jade-editor'['template-selector']

$('a.template').live('click', function(e) {
    var target = $(e.target)
    loadTemplate(target.attr('feature'), target.attr('template'))
})
$('input.new.template').live('keyup', function(e){
    if(e.which === 13) {
        var feature = $(e.target).attr('feature')
        var template = this.value
        
        var replace = templates.templates.render({
            feature: feature,
            templates: [template]
        })
        $(this).parent().replaceWith(replace)

        newTemplate(feature, template)
    }
})
$('input.new.feature').live('keyup', function(e){
    if(e.which === 13) {
        var replace = templates.features.render({
            features: [ { name: this.value, templates: [] }]
        })
        $(this).parent().replaceWith(replace) 
        
        //some kind of feature TOUCH?
    }
})