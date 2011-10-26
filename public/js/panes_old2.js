function Panes(panes, options) {
	
	options = options || {}
	var self = this
	self.element = panes
	panes.top = panes.children('.top')
	panes.bottom = panes.children('.bottom')
	panes.left = panes.children('.left')
	panes.right = panes.children('.right')
	panes.hasLeftRight = panes.top.length > 1 || panes.bottom.length > 1 
	panes.hasTopBottom = panes.left.length > 1 || panes.right.length > 1
	panes.sizer = panes.children('.sizer')
	
	var sizer = new Sizer(panes.children('.sizer'), self)
	
	if(panes.hasLeftRight) { sizer.dragX() }

	this.dragStart = function(drag) {
		if(self.parent) {
			self.parent.dragStart(drag)
		} else {
			drag.panes = panes.find('.pane')
			drag.panes.removeClass('shadow')
			
			drag.panes.addClass('no-pointer-events')
			drag.iframes = drag.panes.find('iframe')
			drag.iframes.addClass('no-pointer-events')			
		}	
	}
	this.dragEnd = function(drag) {
		drag.panes.addClass('shadow')
		drag.panes.removeClass('no-pointer-events')
		drag.iframes.removeClass('no-pointer-events')
	}

	sizer.bind('start', this.dragStart)
    sizer.bind('end', this.dragEnd)
	
	sizer.bind('moveX', function(pos) {
		panes.left.css('right', pos.low)
		panes.right.css('left', pos.high)
	})
	
	this.size = function(x, y) {
		widthManager.size(x)
		heightManager.size(y)
		if(self.nested) { self.nested.resize()}
		fire_onresize()
	}
	

	
	this.resize = function() {
		self.trigger('resized')
	}
	
	var resizeFn
	this.onresize = function(fn) {
		resizeFn = fn
	}
	var fire_onresize = function() {
		if(resizeFn) { resizeFn() }
	}
	/*
	setTotalSize()
	
	sizer.positionByRatio()
	var widthRatio = options.widthRatio || .5
	var heightRatio = options.heightRatio || .5
	var x = (panes.width() * widthRatio) - (panes.sizer.width()/2)
	 ,	y = (panes.height() * heightRatio) - (panes.sizer.height()/2)
	panes.sizer.css('top', y)
	panes.sizer.css('left', x)
	
	this.size(x, y)
	*/
	/*
	panes.children('.pane').each(function(index, childPane){
		var $childPane = $(childPane)
		$childPane.children('.panes').each(function(index, nested) {
			var $nested = $(nested)
			$childPane.addClass('fill')
			$nested.addClass('nested')
			
			var nestedPanes = new Panes($nested)
			self.nested = nestedPanes
			nestedPanes.onresize(fire_onresize)
			nestedPanes.parent = self;
		})		
	})
	*/
	
	panes.addClass('loaded')
	//this.resize()
}
eventer.mixin(Panes)

Panes.init = function(panes, options){
	var panes =  new Panes(panes, options)
	window.onresize = panes.resize
	return panes
}