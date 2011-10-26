var eventer = MicroEvent //require('microevent')

if(!Number.prototype.half) {
    Number.prototype.half = function () {
        return this/2
    }
}

function Sizer(element, container) {
    var self = this
	self.element = element
    
    var Dimension = function(D, measurer, setter) {
        var dimension = this
         ,  d_
         ,  sizer_ = measurer.call(element)
		 ,	margin_ = (element.outerWidth(true) - element.outerWidth()).half()
		 ,	min_ = -margin_.half()
         ,  container_ = measurer.call(container.element)
		 
		console.log('margin', margin_)
        function containerResize() {
			var oldSize = container_
            container_ = measurer.call(container.element)
			if(container_ !== oldSize) {
				var ratio = (d_ + sizer_.half())/oldSize
				dimension.positionByRatio(ratio)
			}
        }
        container.bind('resized', containerResize)
          
        this.position = function(d) {
            d_ = Math.max(min_, d);
			d_ = Math.min(d_, container_ - sizer_)
            setter.call(element, d_)
			
			var pos = {
				low: container_ - d_ - margin_
			 ,	high: d_ + sizer_ + margin_
			}
			console.log('d', d_, 'low', pos.low, 'high', pos.high)
			self.trigger('move' + D, pos)
        }
        this.positionByRatio = function(ratio) {
            var d = (container_ * ratio) - sizer_.half()
            dimension.position(d)
        }
		this.drag = function() {
			element
				.drag('init', function(ev, dd) {
					self.trigger('start', dd.sizer = {})
				})
				.drag(function( ev, dd ){
					dimension.position(dd['offset' + D]) 
				}, { relative: true })
				.drag('end', function(ev, dd) { self.trigger('end', dd.sizer) })
		}
    }
    
	var measureWidth = function(){ return this.width() }
	,	measureHeight = function(){ return this.height() }
	,	setLeft = function(x){ element.css('left', x) }
	,	setTop = function(y){ element.css('top', y) }
	
	var xDimension = new Dimension('X', measureWidth, setLeft)
	var yDimension = new Dimension('Y', measureHeight, setTop) 
	
	xDimension.positionByRatio(.61)
	yDimension.positionByRatio(.5)
    
	this.dragX = function() { xDimension.drag() }
	this.dragY = function() { yDimension.drag() }
	
}
eventer.mixin(Sizer)

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= Sizer
}

/*
//auto-add these

var container = $('#container')
var sizer = $('.sizer')

var coreDrag = sizer.drag
sizer.drag = function(fn) {
	coreDrag.call(sizer, fn, { relative: true })
}


function Dimension(D, measurer, setter) {
    var dimension = this
     ,  d_
     ,  sizer_ = measurer.call(sizer)
     ,  container_ = measurer.call(container)
    
    function containerResize() {
        var ratio = d_/container_
        container_ = measurer.call(container)
        dimension.positionByRatio(ratio)
    }
    container.bind('resized', containerResize)
      
    this.position = function(d) {
        d_ = Math.max(0, d);
        d_ = Math.min(d_, container_ - sizer_)
        setter.call(sizer, d_)
    }
    this.positionByRatio = function(ratio) {
        var d = (container_ * ratio) - sizer_.half()
        dimension.position(d)
    }
    this.dragHandler = function(ev, dd) {
        dimension.position(dd['offset' + D]) 
    }
}

var measureWidth = function(){ return this.width() }
 ,	measureHeight = function(){ return this.height() }
 ,	setLeft = function(x){ sizer.css('left', x) }
 ,	setTop = function(y){ sizer.css('top', y) }
 
var xDimension = new Dimension('X', measureWidth, setLeft)
var yDimension = new Dimension('Y', measureHeight, setTop) 

xDimension.positionByRatio(.61)
yDimension.positionByRatio(.5)
sizer.drag(xDimension.dragHandler)
 */