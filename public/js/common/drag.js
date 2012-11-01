function Drag(target, handle) {
  
  var doc = target.ownerDocument
   ,  self = this
   ,  drag = {}

  handle = handle || target
  handle.addEventListener(Drag.startEvent, _start, false);

  /*
    // todo: fix Android, this is how jquery does it...

    // Calculate pageX/Y if missing and clientX/Y available
    if ( event.pageX == null && event.clientX != null ) {
      var doc = doc.documentElement, body = doc.body;
      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc   && doc.clientTop  || body && body.clientTop  || 0);
    }
  */

  function _start(e) {

    if(self.start) { self.start() }

    e.preventDefault()
    
    drag.target = target
    drag.startX = e.pageX
    drag.startY = e.pageY
    drag.startWidth = target.offsetWidth
    drag.startHeight = target.offsetHeight
    drag.offsetX = e.pageX - target.offsetLeft
    drag.offsetY = e.pageY - target.offsetTop

    doc.addEventListener(Drag.moveEvent, _move, false);
    doc.addEventListener(Drag.endEvent, _end, false);

    return false;
  }

  function _move(e) {

    e.preventDefault()
    if(Drag.hasTouch) { e = e.targetTouches[0] }

    self.move(e, drag)
    if(self.moved) { self.moved() }

    return false;
  }

  self.move = function(e /*, drag*/) {
      /*drag.*/target.style.left = (e.pageX - drag.offsetX) + 'px'
      /*drag.*/target.style.top = (e.pageY - drag.offsetY) + 'px'
  }

  function _end(e) {

    e.preventDefault()
    
    doc.removeEventListener(Drag.moveEvent, _move, false);
    doc.removeEventListener(Drag.endEvent, _end, false);
    
    if(self.end) { self.end() }

    return false;
  }

}

var hasTouch = 'ontouchstart' in document.documentElement
 ,  startEvent = hasTouch ? 'touchstart' : 'mousedown'
 ,  moveEvent = hasTouch ? 'touchmove' : 'mousemove'
 ,  endEvent = hasTouch ? 'touchend' : 'mouseup'

Drag.__defineGetter__('hasTouch', function() { 
  return hasTouch 
})
Drag.__defineGetter__('startEvent', function() { 
  return startEvent 
})
Drag.__defineGetter__('moveEvent', function() { 
  return moveEvent 
})
Drag.__defineGetter__('endEvent', function() { 
  return endEvent 
})
