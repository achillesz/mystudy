var dragObject = {
	selectedObject: null,
	offsetX:0,
	offsetY:0,
	engageDrag: function(evt){
		evt = (evt) ? evt : window.event;
		dragObject.selectedObject = (evt.target) ? evt.target : evt.srcElement;
		var target = evt.target ? evt.target : evt.srcElement;
		var dragContainer = target;
		while(target.className != 'draggable' && target.parentNode){
			target = dragContainer = target.parentNode;
			}
		if(dragContainer){
			dragObject.selectedObject = dragContainer;
			DHTMLAPI.setZIndex(dragContainer,100);
			dragObject.setOffsets(evt,dragContainer);
			dragObject.setDragEvents();
			evt.cancelBubble = true;
			evt.returnValue = false;
			if(evt.stopPropagation){
				evt.stopPropagation();
				evt.preventDefault();
				}
			}
		},
	setOffsets:function(evt,dragContainer){
		if(evt.pageX){
			dragObject.offsetX = evt.pageX - ((dragContainer.offsetLeft) ? dragContainer.offsetLeft : dragContainer.left);
			dragObject.offsetY = evt.pageY - ((dragContainer.offsetTop) ? dragContainer.offsetTop : dragContainer.top);
			}
		else if(evt.clientX || evt.clientY){
			dragObject.offsetX = document.documentElement.scrollLeft + evt.clientX - dragContainer.offsetLeft;
			dragObject.offsetY = document.documentElement.scrollTop + evt.clientY - dragContainer.offsetTop;
			}
		},
	dragIt: function(evt){
		evt = (evt) ? evt : window.event;	
		var obj = dragObject;
		if(evt.pageX){
			DHTMLAPI.moveTo(obj.selectedObject,(evt.pageX - obj.offsetX),(evt.pageY - obj.offsetY));
			}
		else if(evt.clientX || evt.clientY){
			DHTMLAPI.moveTo(obj.selectedObject,(document.documentElement.scrollLeft + evt.clientX - obj.offsetX),(document.documentElement.scrollTop + evt.clientY -obj.offsetY));
			}
		evt.cancelBubble = true;
		evt.returnValue = false;
		},
	releaseDrag: function(){
		DHTMLAPI.setZIndex(dragObject.selectedObject,0);
		dragObject.clearDragEvents();
		dragObject.selectedObject = null;
		},
	setDragEvents: function(){
		addEvent(document,"mousemove",dragObject.dragIt,false);
		addEvent(document,"mouseup",dragObject.releaseDrag,false);
		},
	clearDragEvents: function(){
		removeEvent(document,"mousemove",dragObject.dragIt,false);
		removeEvent(document,"mouseup",dragObject.releaseDrag,false);
		},
	init: function(){
		var elems = [];
		if(document.all){
				elems = document.body.all;
			}
		else if(document.body && document.getElementsByTagName){
				elems = document.body.getElementsByTagName('*');
			}
		for(var i = 0; i <elems.length; i++){
			if(elems[i].className.match(/draggable/)){
					addEvent(elems[i],'mousedown',dragObject.engageDrag,false);
				}
			}
		}
	}