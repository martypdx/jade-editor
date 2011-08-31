function Panes($panes) {
	
	var self = this
	this.panes = $panes
	var sizer = $panes.children('.sizer')
	var childPanes = $panes.children('.pane')
	var allPanes = $panes.find('.pane')
	var upper = this.upper = $panes.children('.upper')
	var left = this.left = $panes.children('.left')
	var right = this.right = $panes.children('.right')
	var lower = this.lower = $panes.children('.lower')
	this.nested = null
	
	//magic adjustment numbers :(
	this.outerBorder = 6
	var border = 6
	  ,	sizeAdj = 7
	  , positionAdj = 9
	var min = 10, maxOffTotal = 30 
	  
	var totalWidth,	totalHeight
	
	this.setOuterBorder = function(value){
		this.outerBorder = value
	}
	
	this.size = function(x, y) {
		if(x) {
			sizer.css('left', x)
			if(upper.length > 1 || lower.length > 1) {
				left.css('width', 	x - this.outerBorder + sizeAdj)
				right.css('left', 	x + border + positionAdj)
			}
		}
		if(y) { 
			sizer.css('top', y) 
			if(left.length > 1 || right.length > 1) {
				upper.css('height', y - this.outerBorder + sizeAdj)  
				lower.css('top', 	y + border + positionAdj )
			}
		}
		if(self.nested) { self.nested.resize()}
		fireOnresize()
	}
	
	sizer
		.drag('init', function() {
			$panes.find('.pane')
				.removeClass('shadow')
				.addClass('no-pointer-events')
		})
		.drag(function( ev, dd ){
			var x, y
			if(upper.length > 1 || lower.length > 1) {
				x = Math.max(dd.offsetX, min)
				x = Math.min (x, totalWidth - maxOffTotal)
			}
			if(left.length > 1 || right.length > 1) {
				y = Math.max(dd.offsetY, min)
				y = Math.min (y, totalHeight - maxOffTotal)
			}
			self.size(x, y) 
		}, { relative: true })
		.drag('end', function() {
			$panes.find('.pane')
				.addClass('shadow')
				.removeClass('no-pointer-events')
		})
	
	function setTotalSize() {
		totalWidth = $panes.width()
		totalHeight = $panes.height()	
	}
	this.resize = function() {
		var currentPos = sizer.position()
		 ,	xRatio = currentPos.left / totalWidth
		 ,	yRatio = currentPos.top / totalHeight
		
		setTotalSize()
		
		self.size(xRatio * totalWidth, yRatio * totalHeight)
	}
	
	var resizeFn = null
	this.onresize = function(fn) {
		resizeFn = fn;
	}
	function fireOnresize() {
		if(resizeFn) { resizeFn() }
	}
	
	setTotalSize()
	var sizerMiddle = sizer.width()/ 2	
	var x = (totalWidth / 2) - sizerMiddle
	 ,	y = (totalHeight / 2) - sizerMiddle
	this.size(x, y)
	
	
	childPanes.each(function(index, childPane){
		var $childPane = $(childPane)
		$childPane.children('.panes').each(function(index, nested) {
			var $nested = $(nested)
			$childPane.addClass('fill')
			$nested.addClass('nested')
			var nestedPanes = new Panes($nested)
			nestedPanes.setOuterBorder(0)
			nestedPanes.resize()
			self.nested = nestedPanes
			nestedPanes.onresize(fireOnresize)
		})		
	})
	
	$panes.addClass('loaded')
}

Panes.init = function($panes){
	var panes =  new Panes($panes)
	window.onresize = panes.resize
	return panes
}