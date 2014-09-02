//����¼�
function addEvent(elem,evtType,func,capture){
	capture = (capture) ? capture : false;
	if(elem.addEventListener){
			elem.addEventListener(evtType, func, capture);
		}
	else if(elem.attachEvent){
			elem.attachEvent('on' + evtType,func);
		}
	else{
		//for Ie/mac,nn4,and older
		elem["on" + evtType] = func;
		}
	}
//�Ƴ��¼�	
function removeEvent(elem,evtType,func,capture){
	capture = (capture) ? capture : false;      
	if(elem.removeEventListener){
		elem.removeEventListener(evtType,func,capture);
		}
	else if(elem.attachEvent){
		elem.detachEvent('on' + evtType,func);
		}
		elem['on' + evtType] = null;
	}
//��Ӷ��load�¼�
function addOnLoadEvent(func){
	if(window.addEventListener || window.attachEvent){
		addEvent(window,"load", func, false);
		}
	else{
		var oldQueue = (window.onload) ? window.onload : function(){};
		window.onload = function(){
			oldQueue();
			func();
			}
		}
	}
//�������������ƽ���е�λ��
function getPageEventCoords(evt){
	var coords = {left:0, top:0};
	if(evt.pageX){
		coords.left = evt.pageX;
		coords.top = evt.pageY;
		}
	else if(evt.clientX){
		coords.left = evt.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
		coords.top = evt.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
		//���ܵĻ�������HTMLԪ�صĿհ�
/*		if(document.body.parentElement && document.body.parentElement.clientLeft){
			var bodParent = document.body.parentElement;
			coords.left += bodParent.scrollLeft - bodParent.clientLeft;
			coords.top += bodParent.scrollTop - bodParent.clientTop;
			}*/
		}
	return coords;
}

function getPositionedEventCoords(evt){
	var elem = (evt.parget) ? evt.target : evt.srcElement;
	var coords = {left:0,top:0};
	if(evt.layerX){
		var borders = {
			left:parseInt(DHTMLAPI.getComputedStyle("progressBar","border-left-width")),
			top:parseInt(DHTMLAPI.getComputedStyle("progressBar","border-top-width"))
			};
		coords.left = evt.layerX - borders.left;
		coords.top = evt.layerY - borders.top;
		}
	else if(evt.offsetX){
		coords.left = evt.offsetX;
		coords.top = evt.offsetY;
		}
	evt.cancelBubble = true;
	return coords;
	}