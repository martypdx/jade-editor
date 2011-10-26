function Panes(panes, options) {
	
	options = options || {}
	var self = this
	
	panes.top = panes.children('.top')
	panes.bottom = panes.children('.bottom')
	panes.left = panes.children('.left')
	panes.right = panes.children('.right')
	panes.hasLeftRight = panes.left.length > 1 || panes.right.length > 1
	panes.hasTopBottom = panes.top.length > 1 || panes.bottom.length > 1
	panes.sizer = panes.children('.sizer')
	
	//var sizer = panes.children('.sizer')
	
	var heightManager = new HeightManager()
	var widthManager = new WidthManager()
	
	function NoopManager() {
		this.size = function() {}
		this.updateTotalSize = function() { return false }	
	}
	
	function HeightManager() {
		return panes.hasLeftRight
			? new SizingManager('Height', 'top', 'bottom')
			: new NoopManager()
	}
	
	function WidthManager() {
		return panes.hasTopBottom
			? new SizingManager('Width', 'left', 'right')
			: new NoopManager() 
	}
	
	function SizingManager(dimension, lesser, greater) {
		var mgr = this
		mgr.total = null
		
		var upper = panes[lesser]
		 , 	lower = panes[greater]
		 ,	sizerDimension = panes.sizer['outer' + dimension](true)
		 ,	minMax = sizerDimension * 2.5
		 
		mgr.total = panes[dimension.toLowerCase()]()
		
		mgr.updateTotalSize = function() {
			var newTotal = panes[dimension.toLowerCase()]()
			if(newTotal === mgr.total) { return false }
			
			var sizerRatio = panes.sizer.position()[lesser] / mgr.total
			mgr.total = newTotal
			mgr.size(sizerRatio * newTotal)
		
			return true;
		}

		mgr.size = function(value) {
			if(!hasValue(value)) { return }
			value = enforceMinMax(value)
			positionSizer(value)
			sizePanels(value)
		}
		function hasValue(value) {
			return value === 0 || value
		}
		function enforceMinMax(value) { 
			value = Math.max(value, minMax)
			return Math.min (value, mgr.total - minMax)
		}
		function positionSizer(value) { 
			panes.sizer.css(lesser, value)
		}
		function sizePanels(value) { 
			upper.css(greater, mgr.total - value)
			lower.css(lesser, value + sizerDimension )
		}		
	}
	
	function setTotalSize() {
		return widthManager.updateTotalSize() && heightManager.updateTotalSize()
	}
	
	panes.sizer
		.drag('init', function(ev, dd) {
			panes.sizer.addClass('dragging')
			self.dragInit(ev, dd)
		})
		.drag(function( ev, dd ){
			self.size(dd.offsetX, dd.offsetY)
			
		}, { relative: true })
		.drag('end', function(ev, dd) {
			panes.sizer.removeClass('dragging')
			self.dragEnd(ev, dd)
		})
		

	
	this.size = function(x, y) {
		widthManager.size(x)
		heightManager.size(y)
		if(self.nested) { self.nested.resize()}
		fire_onresize()
	}
	
	this.dragInit = function(ev, dd) {
		if(self.parent) {
			self.parent.dragInit(ev, dd)
		} else {
			dd.panes = panes.find('.pane')
			dd.panes.removeClass('shadow')
			
			dd.panes.addClass('no-pointer-events')
			dd.iframes = dd.panes.find('iframe')
			dd.iframes.addClass('no-pointer-events')			
		}	
	}
	this.dragEnd = function(ev, dd) {
		dd.panes.addClass('shadow')
		dd.panes.removeClass('no-pointer-events')
		dd.iframes.removeClass('no-pointer-events')
	}
	
	this.resize = function() {
		var currentPos = panes.sizer.position()
		 ,	xRatio = currentPos.left / widthManager.total
		 ,	yRatio = currentPos.top / heightManager.total
		
		if(setTotalSize()) {
			//uses 'new' self .width & .height
			self.size(xRatio * widthManager.total, yRatio * heightManager.total)			
		}
	}
	
	var resizeFn
	this.onresize = function(fn) {
		resizeFn = fn
	}
	var fire_onresize = function() {
		if(resizeFn) { resizeFn() }
	}
	
	setTotalSize()
	var widthRatio = options.widthRatio || .5
	var heightRatio = options.heightRatio || .5
	var x = (panes.width() * widthRatio) - (panes.sizer.width()/2)
	 ,	y = (panes.height() * heightRatio) - (panes.sizer.height()/2)
	panes.sizer.css('top', y)
	panes.sizer.css('left', x)
	this.size(x, y)
	
	
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
	
	
	this.resize()
	
	panes.addClass('loaded')
}

Panes.init = function(panes, options){
	var panes =  new Panes(panes, options)
	
	return panes
}