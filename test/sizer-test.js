var sink = require('sink-test');
var start = sink.start;
sink = sink.sink;

var testContainerWidth = 1000
 ,  testContainerHeight = 500
 ,  testElementSize = 10
 
function Container() {
    this.width = function() {
        return testContainerWidth
    }
    this.height = function() {
        return testContainerHeight
    }
}
require('microevent').mixin(Container)


function Element() {
    this.css = function(values){
        for (prop in values) {
            this[prop] = values[prop]
        }
    }
    this.outerWidth = function(margins) {
        return margins ? testElementSize : 0
    }
    this.outerHeight = function(margins) {
        return margins ? testElementSize : 0
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
        ok(sizer.maxWidth === testContainerWidth - sizer.minMaxMargin, 'sizer.maxWidth set')
        ok(sizer.maxHeight === testContainerHeight - sizer.minMaxMargin, 'sizer.maxHeight set')
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
    
    test('sizer change on container dimension change', 2, function() {
        var newSize = { width: 500, height: 250 }
        container.trigger('resized', newSize )
        ok(sizer.maxWidth === newSize.width - sizer.minMaxMargin, 'new sizer.maxWidth set')
        ok(sizer.maxHeight === newSize.height - sizer.minMaxMargin, 'new sizer.maxHeight set')
    })
    
    test('sizer dimensions exists', 2, function() {
        ok(sizer.width, 'sizer.width exists')
        ok(sizer.width === testElementSize, 'sizer.width is element width')
        ok(sizer.height, 'sizer.height exists')
        ok(sizer.height === testElementSize, 'sizer.height is element height')
    })
    
    test('default .5 postioning ratio on intialize', 2, function() {
        ok(element.top == testContainerHeight/2 - testElementSize/2, 'default top set')
        ok(element.left == testContainerWidth/2 - testElementSize/2, 'default top set')
    })
})

start()
