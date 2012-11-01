 function getMeasures(element) {
	var measures
	if(typeof jQuery !== 'undefined' && element instanceof jQuery) {
 		var position = element.position()
 		measures = {
	 		width: element.width()
         ,  height: element.height()
         ,  top: position.top
         ,  left: position.left  			
        }			
	} else if(typeof HTMLElement !== 'undefined' && element instanceof HTMLElement) {
		measures = {
	 		width: element.offsetWidth
         ,  height: element.offsetHeight
         ,  top: element.offsetTop
         ,  left: element.offsetLeft 
        }
	} else {
		throw new Error('`element` must be HTMLElement or jQuery object')
	}	
	return measures
 }

 var animations = { 

 	shrinkToCenter: function(target) {
 		var measures = getMeasures(target)

 		return {
	        height: 0, 
	        width: 0, 
	        opacity: 0,
	        top: measures.top + (measures.height/2),
	        left: measures.left + (measures.width/2)   
	    };
 	}
  ,	shrinkToOrigin: function() {
 		return {
	        height: 0, 
	        width: 0, 
	        opacity: 0,
	        top: 0,
	        left: 0   
	    };
 	}

 }