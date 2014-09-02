// JavaScript Document
//ȫ�ֱ���
var scrollEngaged = false;
var scrollInterval;
var scrollBars = new Array();
/*��������������*/
function scrollBar(rootID,ownerID,ownerContentID){
	this.rootID = rootID;
	this.ownerID = ownerID;
	this.ownerContentID = ownerContentID;
	this.index = scrollBars.length;
	//��������������ʹ�õ�һ���Լ���
	this.rootElem = document.getElementById(rootID);
	this.ownerElem = document.getElementById(ownerID);
	this.contentElem = document.getElementById(ownerContentID);	
	this.ownerHeight = parseInt(DHTMLAPI.getComputedStyle(ownerID,'height'));
	this.ownerWidth = parseInt(DHTMLAPI.getComputedStyle(ownerID,'width'));
	this.ownerBorder = parseInt(DHTMLAPI.getComputedStyle(ownerID,'border-top-width'))*2;
	this.contentHeight = Math.abs(parseInt(this.contentElem.style.top));
	this.contentWidth = this.contentElem.offsetWidth;
	this.contentFontSize = parseInt(DHTMLAPI.getComputedStyle(this.ownerContentID,"font-size"));
	this.contentScrollHeight = this.contentElem.scrollHeight;
	//overflow�Ĳ�����־
	this.overflow = (this.contentScrollHeight >= this.ownerHeight) ? 1 : 0;
	/*��������ģʽ������Ĭ��ֵΪ0��CSS����ģʽ��*/
	//�Ժ���Ϊquirksģʽ��д�ʵ���ֵ
	this.quirks = {on:false,ownerBorder:0, scrollBorder:0,contentPadding:0};
	if(navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.indexOf("Win") && (typeof document.compatMode == "undefined" || document.compatMode == "BackCompat")){
		this.quirks.on = true;
		this.quirks.ownerBorder = this.ownerBorder;
		this.quirks.contentPadding = parseInt(DHTMLAPI.getComputedStyle(ownerContentID,'padding'));
		}
	//�ڹ�������ʼ��ʱ����
	this.scrollWrapper = null;
	this.upButton = null;
	this.dnButton = null;
	this.thumb = null;
	this.buttonLength = 0;
	this.thumbLength = 0;
	this.scrollWrapperLength = 0;
	this.dragZone = {left:0, top:0, right:0,bottom:0}
	this.appendScroll = appendScrollBar;
	}
	//��������Ԫ�ز���ӵ�α������
	function appendScrollBar(){
		var imgH = 16;
		var imgW = 16;
		var thumbH = 27;
		var lineup = document.createElement("img");
		lineup.id = "lineup" + (scrollBars.length - 1);
		lineup.className = "lineup";
		lineup.index = this.index;
		lineup.src = "i/up.png";
		lineup.height = imgH;
		lineup.width = imgW;
		lineup.alt = "Scroll up";
		lineup.style.position = "absolute";
		lineup.style.top = "0px";
		lineup.style.left = "0px";
		var wrapper = document.createElement('div');
		wrapper.id = "scrollWrapper" + (scrollBars.length - 1);
		wrapper.className = "scrollWrapper";
		wrapper.index = this.index;
		wrapper.style.position = "absolute";
		wrapper.style.visibility = "hidden";
		wrapper.style.top = "0";
		wrapper.style.left = this.ownerWidth + this.ownerBorder - this.quirks.ownerBorder + 'px';
		wrapper.style.borderTop ="2px solid #666";
		wrapper.style.borderLeft ="2px solid #666";
		wrapper.style.borderRight ="2px solid #ccc";
		wrapper.style.borderBottom ="2px solid #ccc";
		wrapper.style.backgroundColor = "#999";
		if(this.quirks.on){
			this.quirks.scrollBorder = 2;
			}
		wrapper.style.width = lineup.width + (this.quirks.scrollBorder * 2) + "px";
		wrapper.style.height = this.ownerHeight + (this.ownerBorder - 4) - (this.quirks.scrollBorder * 2) + "px";
		var linedn = document.createElement("img");
		linedn.id = "linedown" + (scrollBars.length - 1);
		linedn.className = "linedown";
		linedn.index = this.index;
		linedn.src = "i/down.png";
		linedn.height = imgH;
		linedn.width = imgW;
		linedn.alt = "Scroll Down";
		linedn.style.position = "absolute";
		linedn.style.top = parseInt(this.ownerHeight) + (this.ownerBorder - 4) - (this.quirks.ownerBorder) - linedn.height + 'px';
		linedn.style.left = "0px";
		//�̶���С�Ŀ��϶�����
		var thumb = document.createElement('img');
		thumb.id = "thumb" + (scrollBars.length - 1);
		thumb.className = "draggable";
		thumb.index = this.index;
		thumb.src = "i/thumb.png";
		thumb.height = thumbH;
		thumb.width = imgW;
		thumb.alt = "Scroll Dragger";
		thumb.style.position = "absolute";
		thumb.style.top = lineup.height + 'px';
		thumb.style.width = imgW + 'px';
		thumb.style.height = thumbH + 'px';
		thumb.style.left = "0px";
		//����overflow������visibility
		thumb.style.visibility = (this.overflow) ? "visible" : "hidden";
		//��������Ⱦ��Ԫ�����scrollBar��������
		this.upButton = wrapper.appendChild(lineup);
		this.thumb = wrapper.appendChild(thumb);
		this.dnButton = wrapper.appendChild(linedn);
		this.scrollWrapper = this.rootElem.appendChild(wrapper);
		this.buttonLength = imgH;
		this.thumbLength = thumbH;
		this.scrollWrapperLength = parseInt(DHTMLAPI.getComputedStyle(this.scrollWrapper.id,'height'));
		if(this.overflow){
			this.scrollWrapper.onmousedown = handleScrollClick;
			this.scrollWrapper.onmouseup = handleScrollStop;
			this.scrollWrapper.oncontextmenu = blockEvent;
			this.scrollWrapper.ondrag = blockEvent;
			}
		this.scrollWrapper.style.visibility = "visible";	
		if(navigator.userAgent.indexOf('Opera') != -1){
			var me = this;
			setTimeout(function(){
				me.scrollWrapperLength = parseInt(DHTMLAPI.getComputedStyle(me.scrollWrapper.id,'height'));
				me.dragZone.bottom = me.scrollWrapperLength - me.buttonLength;
				},0);
			}
			
			dragObject.init();
		}
		/*ʱ�䴦����*/
		//onmouseupʱ�䴦��
		function handleScrollStop(){
			scrollEngaged = false;
			}
		function blockEvent(evt){
			evt = (evt) ? evt : event;
			evt.cancelBubble = true;
			return false;
			}
		function handleScrollClick(evt){
			var fontSize,contentHeight;
			evt = (evt) ? evt : event;
			var target = (evt.target) ? evt.target : evt.srcElement;
			target = (target.nodeType == 3) ? target.parentNode : target;
			var index = target.index;
			fontSize = scrollBars[index].contentFontSize;
			switch(target.className){
				case "lineup":
					scrollEngaged = true;
					scrollBy(index,parseInt(fontSize));
					scrollInterval = setInterval("scrollBy(" + index + "," + parseInt(fontSize) + ")" , 100);
					evt.cancelBubble = true;
					return false;
					break;
				case "linedown":
					scrollEngaged = true;
					scrollBy(index, -(parseInt(fontSize)));
					scrollInterval = setInterval("scrollBy(" + index + " , -" + parseInt(fontSize) + ")", 100);
					evt.cancelBubble = true;
					return false;
					break;
				case "scrollWrapper":
					scrollEngaged = true;
					var evtY = (evt.offsetY) ? evt.offsetY : ((evt.layerY) ?  evt.layerY : -1);
					if(evtY >= 0){
						var pageSize = scrollBars[index].ownerHeight - fontSize;
						var thumbElemStyle = scrollBars[index].thumb.style;
						if(evtY > (parseInt(thumbElemStyle.top)) + scrollBars[index].thumbLength){
								pageSize = -pageSize;
							}
						scrollBy(index,pageSize);
						scrollInterval = setInterval("scrollBy(" + index + ", " + pageSize + ")",100);
						evt.cancelBubble = true;
						return false;
						}
				}
				return false;
			}
		//�����ڲ��ĵ�����
		function scrollBy(index,px){
			var scroller = scrollBars[index];
			var elem = document.getElementById(scroller.ownerContentID);
			var top = parseInt(elem.style.top);
			var scrollHeight = parseInt(elem.scrollHeight);
			var height = scroller.ownerHeight;
			if(scrollEngaged && top + px >= -scrollHeight + height && top + px <= 0){
				DHTMLAPI.moveBy(elem,0,px);
				updateThumb(index);
				}
			else if(top + px < -scrollHeight + height){
					DHTMLAPI.moveTo(elem,0,-scrollHeight + height - scroller.quirks.contentPadding);
					updateThumb(index);
					clearInterval(scrollInterval);
				}
			else if(top + px > 0){
					DHTMLAPI.moveTo(elem,0,0);
					updateThumb(index);
					clearInterval(scrollInterval);
				}
			else{
					clearInterval(scrollInterval);
				}
			
			}
		/*����������*/
		//��ʹ�ü�ͷ/��ҳ�������֮�����û����λ��
		function updateThumb(index){
			var scroll = scrollBars[index];
			var barLength = scroll.scrollWrapperLength - (scroll.quirks.scrollBorder * 2);
			var buttonLength = scroll.buttonLength;
			barLength -= buttonLength * 2;
			var docElem = scroll.contentElem;
			var docTop = Math.abs(parseInt(docElem.style.top));
			var scrollFactor = docTop/(scroll.contentScrollHeight - scroll.ownerHeight);
			DHTMLAPI.moveTo(scroll.thumb,0,Math.round((barLength - scroll.thumbLength) * scrollFactor) + buttonLength);
			}
		//���ݻ���λ�ö�λ����
		function updateScroll(){
			var index = dragObject.index;
			var scroller = scrollBars[index];
			var barLength = scroller.scrollWrapperLength - (scroller.quirks.scrollBorder * 2);
			var buttonLength = scroller..buttonLength;
			var thumbLength = scroller.thumbLength;
			var wellTop = buttonLength;
			var wellBottom = barLength - buttonLength - thumbLength;
			var wellSize = wellBottom - wellTop;
			var thumbTop = parseInt(DHTMLAPI.getComputedStyle(scroller.thumb.id,"top"));
			var scrollFactor = (thumbTop - buttonLength)/wellSize;
			var docElem = scroller.contentElem;
			var docTop = Math.abs(parseInt(docELem.style.top));
			var scrollHeight = scroller.contentScrollHeight;
			var height = scroller.ownerHeight;
			DHTMLAPI.moveTo(scroller.ownerContextID,0,-(Math.round((scrollHeight - height)*scrollFactor)));
			}		
		//Ԫ���϶�
		var dragObject = {
			selectedObject: null,
			offsetX: 0,
			offsetY: 0,
			index: 0,
			//onmousedownʱ����
			engageDrag: function(evt){
					evt = (evt) ? evt : window.event;
					var target = (evt.target) ? evt.target : evt.srcElement;
					if(target.id.indexOf("thumb") == 0){
						var dragContainer = target;
						if(dragContainer){
							dragObject.selectedObject = dragContainer;
							dragObject.index = dragContainer.index;
							DHTMLAPI.setZIndex(dragContainer,100);
							dragObject.setOffsets(evt,dragContainer);
							dragObject.setDragEvents();
							evt.canselBubble = true;
							evt.returnValue = false;
							if(evt.stopPropagation){
									evt.stopPropagation();
									evt.preventDefault();
								}
							}
						}
						return false;
				},
			//����mousedown�ڿ��϶�Ԫ���ڲ���ƫ����
			setOffsets: function(evt,dragContainer){
					if(evt.pageX){
						dragObject.offsetX = evt.pageX - ((typeof dragContainer.offsetLeft == "number") ? dragContainer.offsetLeft : dragContainer.left);
						dragObject.offsetY = evt.pageY - ((typeof dragContainer.offsetTop == "number") ? dragContainer.offsetTop : dragContainer.top);
						}
					else if(evt.offsetX || evt.offsetY){
							dargObject.offsetX = evt.clientX - ((typeof dragContainer.offsetLeft == "number")  ? dragContainer.offsetLeft : 0);
							dargObject.offsetY = evt.clientY - ((typeof dragContainer.offsetTop == "number")  ? dragContainer.offsetTop : 0);
						}
				},
			//onmousemoveʱ����
			dargIt: function(evt){
					evt = (evt) ? evt : window.event;
					var x,y,width,height;
					var obj = dragObject;
					if(evt.pageX){
						x = evt.pageX - obj.offsetX;
						y = evt.pageY - obj.offsetY;
						}
					else if(evt.clientX || evt.clientY){
						x = evt.clientX - obj.offsetX;
						Y = evt.clientY - obj.offsetY;
						}
					var index = dragObject.index;
					var scroller = scrollBars[index];
					//����������ʱ��̬����
					var zone = scroller.dragZone;
					width = scroller.thumb.width;
					height =scroller.thumb.height;
					x = (x < zone.left) ? zone.left : ((x + width > zone.right) ? zone.right - width : x);
					y = (y < zone.top) ? zone.top : ((y + height > zone.bottom) ? zone.bottom - height : y);
					DHTMLAPI.moveTo(obj.selectedObject,x,y);
					updateScroll();
					evt.cancelBubble = true;
					evt.returnValue = false;
				},
			//onmouseupʱ����
			releaseDrag: function(evt){
					DHTMLAPI.setZIndex(dragObject.selectedObject,0);
					dragObject.clearDragEvents();
					dragObject.selectedObject = null;
				},
			//������ʱ�¼�
			setDragEvents:function(){
					addEvent(document,"mousemove",dragObject.dragIt,false);
					addEvent(document,"mouseup",dragObject.releaseDrag,false);
				},
			//ɾ����ʱ�¼�
			clearDragEvents:function(){
				removeEvent(document,"mousemove",dragObject.dragIt,false);
				removeEvent(document,"mouseup",dragObject.releaseDrag,false);
				},
			//��ʼ��������mousedown�¼���������
			//ӵ��class = "draggable"���Ե�Ԫ��
			init: function(){
					var elems = [];
					if(document.all){
						 elems = document.body.all;
						}
					else if(document.body && document.body.getElementsByTagName){
						 elems = document.body.getElementsByTagName('*');
						}
					for(var i = 0; i < elems.length; i++){
						if(elems[i].className.match(/draggable/)){
							addEvent(elems[i],"mousedown",dragObject.engageDrag,false)
							}
						}
				}
			}
	
