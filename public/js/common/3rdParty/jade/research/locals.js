       

function newRender(locals) {
    var __ = [{ lineno: 1, filename: undefined }];
    try {
        var buf = [];
        function scope(place) {
        //with (locals || {}) {
           var interp;
            __.unshift({ lineno: 1, filename: __[0].filename });
            __.unshift({ lineno: 1, filename: __[0].filename });
            buf.push('<p>Hello ' + escape((interp = place) == null ? '' : interp) + '');
            __.unshift({ lineno: undefined, filename: __[0].filename });
            __.shift();
            buf.push('</p>');
            __.shift();
            __.shift();
        //}
        }
        scope(locals.place)
        return buf.join("");
    
    } catch (err) {
      rethrow(err, __[0].filename, __[0].lineno);
    }
}


function time(approach, fn) {
    console.log(fn(locals))
    var count = 1000
    var start = new Date()
    for(i=0; i<count; i++) {
        fn(locals)
    }
    console.log(approach, count, 'times: ', new Date() - start)
}
var locals = { place: 'world',
               place2: 'wha',
               place3: 'faa',
               list: ['red','white', 'blue']
}
var jade = require('../../lib/jade')

var template = 'p Hello #{place} #{place2} #{place3}\n'
template+= 'ul\n  each item in list\n'
template+= '    li #{item}'
//time('new render', newRender)
time('noWith', jade.compile(template, { noWith: true, locals: locals, compileDebug: false }))
time('with', jade.compile(template, { compileDebug: false}))

/*
console.log('keys', Object.keys(locals))
console.log('getOwnPropertyNames', Object.getOwnPropertyNames(locals))
*/