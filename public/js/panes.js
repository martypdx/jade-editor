if(!Number.prototype.half) {
    Number.prototype.half = function () {
        return this/2
    }
}

function Panes(panes, options) {
	
	options = options || {}
	var self = this
	
	panes.top = panes.children('.top')
	panes.bottom = panes.children('.bottom')
	panes.left = panes.children('.left')
	panes.right = panes.children('.right')
	panes.hasLeftRight = panes.top.length > 1 || panes.bottom.length > 1 
	panes.hasTopBottom = panes.left.length > 1 || panes.right.length > 1
	
	function Sizer() {
		
		var element = panes.children('.sizer')
		var totalWidth = element.outerWidth()
		var functionalWidth = element.outerWidth(true)
		var totalHeight = element.outerHeight()
		var functionalHeight = element.outerHeight(true)
		var containerWidth = panes.width()
		var containerHeight = panes.height()
		
		this.byRatio = function(xRatio, yRatio) {
			var x = (containerWidth * xRatio) - functionalWidth.half()
			var y = (panes.height() * yRatio) - functionalHeight.half()
            selfSize(x, y)
		}
		
		this.resize = function() {
			var oldWidth = containerWidth
			containerWidth = panes.width()
			var oldHeight = containerHeight
			containerHeight = panes.height()
			if(containerWidth !== oldWidth || containerHeight !== oldHeight) {
				var current = element.position()
				this.byRatio(
					(current.left + functionalWidth.half())/oldWidth
				 ,	(current.top + functionalHeight.half())/oldHeight)
			}
		}
		var selfSize = this.size = function(x, y) {
			if(x === 0 || x) {
				x = Math.max(x,  (totalWidth - functionalWidth) )
				x = Math.min (x, containerWidth - totalWidth)
				element.css('left', x)
				x_ = x
				if(panes.hasLeftRight) {
					panes.left.css('right',  containerWidth - x + 1)
					panes.right.css('left',  x + functionalWidth + 1)
				}
			}
			if(y === 0 || y) { 
				y = Math.max(y,  (totalHeight - functionalHeight) )
				y = Math.min (y, panes.height() - totalHeight)
				element.css('top', y) 
				if(panes.hasTopBottom) {
					panes.top.css('bottom', panes.height() - y + 1)  
					panes.bottom.css('top', y + functionalHeight + 1)
				}
			}
			if(self.nested) { self.nested.resize()}
			fire_onresize()
		}
		
		element
			.drag('init', function(ev, dd) {
				element.addClass('dragging')
				self.dragStart(dd)
			})
			.drag(function( ev, dd ){
				selfSize(
					panes.hasLeftRight ? dd.offsetX : undefined
				 ,	panes.hasTopBottom ? dd.offsetY : undefined)
				
			}, { relative: true })
			.drag('end', function(ev, dd) {
				element.removeClass('dragging')
				self.dragEnd(dd)
			})
	}
	
	var sizer = new Sizer()
	
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
	
	this.resize = function() {
		sizer.resize()
	}
	
	var resizeFn
	this.onresize = function(fn) {
		resizeFn = fn
	}
	var fire_onresize = function() {
		if(resizeFn) { resizeFn() }
	}
	
	var widthRatio = options.widthRatio || .5
	var heightRatio = options.heightRatio || .5
    sizer.byRatio(widthRatio, heightRatio)
	
	panes.children('.pane').each(function(index, childPane){
		var $childPane = $(childPane)
		$childPane.children('.panes').each(function(index, nested) {
			var $nested = $(nested)
			$childPane.addClass('fill')
			$nested.addClass('nested')
			
			var nestedPanes = new Panes($nested, options.subOptions)
			self.nested = nestedPanes
			nestedPanes.onresize(fire_onresize)
			nestedPanes.parent = self;
		})		
	})
	
	
	panes.addClass('loaded')
}

Panes.init = function(panes, options){
	var panes =  new Panes(panes, options)
	window.onresize = panes.resize
	return panes
}