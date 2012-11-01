var sink = require('sink-test');
var start = sink.start;
sink = sink.sink;

sink('editors', function (test, ok) {
    test('should produce standard', 1, function() {
        var html = '<html><style/><body><div>Hello World</div></body></html>'
        ok(html === html, 'standards match')  
    })
        test('should produce standard 2', 1, function() {
        var html = '<html><style/><body><div>Hello World</div></body></html>'
        ok('not ok' === html, 'standards match')  
    })

});


start();