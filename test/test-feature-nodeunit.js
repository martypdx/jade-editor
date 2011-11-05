
exports.feature = function(test) {
    var html = '<html><style/><body><div>Hello World</div></body></html>'
    test.equal('not ok', html, 'standards match')
    test.done()
}

exports.feature2 = function(test) {
    var html = '<html><style/><body><div>Hello World</div></body></html>'
    test.equal(html, html, 'standards match')
    test.done()
}