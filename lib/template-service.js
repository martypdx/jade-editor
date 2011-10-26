var fs = require('fs')
 ,  path = require('path')
 ,  mkdirp = require('mkdirp')


function Service(app) {
    
    this.app = app
    var service = this
    
    var ensureDirExists = function(path, cb) {
        mkdirp(path, 0755, function(err) {
            err ? cb(err) : cb(null, path)    
        })
    }
    var getFeaturesDir = function(cb) {
        ensureDirExists(path.join(app, 'features'), cb)
    }
    var getFeatureNames = function(cb) {
        getFeaturesDir(function(err, featuresDir){
            fs.readdir(featuresDir, cb)    
        })
    }
    var getFeatureDir = function(feature, cb) {
        getFeaturesDir(function(err, featuresDir){
            ensureDirExists(path.join(featuresDir, feature), cb)
        })
    }
    var getTemplateDir = function(feature, template, cb) {
         getFeatureDir(feature, function(err, featureDir){
            ensureDirExists(path.join(featureDir, template), cb)
        })
    }
    var getTemplateNames = function(feature, cb) {
        getFeatureDir(feature, function(err, featureDir){
            fs.readdir(featureDir, cb)    
        })
    }
    
    //hierarchical list of all features and templates
    this.listAll = function(cb) {
        getFeatureNames(function(err, features){        
            var results = { features: [] }
            if(features.length === 0) { return cb(null, results) }
            
            var gotFeature = function(feature) {
                if(results.features.push(feature) === features.length) {
                    results.features.sort(function(a, b) {
                        return a.name < b.name ? -1 : 1    
                    })
                    cb(null, results)
                }
            }
            
            features.forEach(function(feature) {
                getTemplateNames(feature, function(err, templates) {
                    gotFeature({ name: feature, templates: templates.sort() })      
                })
            })   
        })
    }
    
    var templateParts = ['css', 'fn', 'html', 'jade', 'js', 'json']
    
    var templateRoot = function(templateDir, template){
        return path.join(templateDir, template + '.')
    }
    
    //get full template
    var getTemplate = this.getTemplate = function(feature, template, cb) {
        
        getTemplateDir(feature, template, function(err, templateDir) {
            var parts = 0
            var results = { name: template }
            var root = templateRoot(templateDir, template)
            
            var collect = function(name) {
                fs.readFile(root + name, function(err, data) {
                    results[name] = (err) ? "" : data.toString()
                    parts++;
                    if(parts === templateParts.length) { cb(null, results) }
                })
            }
            templateParts.forEach(collect)            
        })
    }
    
    //get all full templates for a feature
    this.getTemplates = function(feature, cb) {
        
        getTemplateNames(feature, function(err, templates) {
            var results = { name: feature, templates: [] }
            if(templates.length === 0) { return cb(null, results) }
            
            var gotTemplate = function(err, template) {
                if(results.templates.push(template) === templates.length) {
                    cb(null, results)
                }
            }
            templates.forEach(function(template) {
                getTemplate(feature, template, gotTemplate)
            })           
        })
    }
    
    //save full template
    this.saveTemplate = function(feature, template, data, cb) {
       
        getTemplateDir(feature, template, function(err, templateDir) {  
            var parts = 0
            var results = {}
            var root = templateRoot(templateDir, template)
            
            var hasError
            var save = function(name) {
                fs.writeFile(root + name, data[name], function(err, data) {
                    if (err) {
                        hasError = true
                        results[name] = err
                    }
                    parts++;
                    if(parts === templateParts.length) { cb((hasError) ? results : null) }
                })
            }
            templateParts.forEach(save)
        })
    
    }
}


var exportObject = {}
exportObject.getApp = function(appDir) {
    return new Service(appDir)
}
module.exports = exportObject