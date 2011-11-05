var sink = require('sink-test');
var start = sink.start;
sink = sink.sink;

function Container() {
    this.width = function() {
        return 1000
    }
    this.height = function() {
        return 700
    }
}

function Element() {
    this.css = function(values){
        for (prop in values) {
            this[prop] = values[prop]
        }
    }
}

var Sizer = require('../public/js/sizer')    

sink('sizer move', function(test, ok, before, after){
    var position, negative_position, too_big_position
    var sizer, container, element
    before(function() {
        position = {top: 100, left: 100}
        negative_position = {top: -100, left: -100}
        too_big_position = {top: 1000000, left: 1000000}
        
        container = new Container()
        element = new Element()
        sizer = new Sizer(element, container)           
    })
    
    test('move to given top and left', 2, function() {
        sizer.move(position)
        ok(position.top === element.top, 'top set')
        ok(position.left === element.left, 'left set')
    })
    
    test('move event fired on move', 2, function() {
        sizer.bind('move', function(movedTo) {
            ok(position.top === movedTo.top, 'top evented')
            ok(position.left === movedTo.left, 'left evented')  
        })
        
        sizer.move(position)
    })
    
    test('sizer has minMaxMargin', 1, function() {
        ok(sizer.minMaxMargin, 'sizer has margin')
    })
    
    test('sizer max based on container dimensions', 2, function() {
        ok(sizer.maxWidth === container.width() - sizer.minMaxMargin, 'sizer.maxWidth set')
        ok(sizer.maxHeight === container.height() - sizer.minMaxMargin, 'sizer.maxHeight set')
    })
    
    test('enforce min position', 2, function() {
        sizer.move(negative_position)
        ok(sizer.min === element.top, 'top set to min')
        ok(sizer.min === element.left, 'left set to min')
    })

    test('enforce max position', 2, function() {
        sizer.move(too_big_position)
        ok(sizer.maxHeight === element.top, 'top set to max')
        ok(sizer.maxWidth === element.left, 'left set to max')
    })

})

start()
