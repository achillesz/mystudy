//DHTML3API.JS��ƽ̨�Զ���API
//����λ������Danny Goodman
//Release 3.0��֧��NN4��IE, and W3C DOMS.

var DHTMLAPI = {
	browserClass: new Object(),
	init: function(){
		this.browserClass.isCSS = ((document.body && document.body.style) ? true : false);
		this.browserClass.isW3C = ((this.browserClass.isCSS && document.getElementById) ? true : fasle);
		this.browserClass.isIE4 = ((this.browserClass.isCSS && document.all) ? true : false);
		this.browserClass.isNN4 = ((document.layers) ? true : false);
		this.browserClass.isIECSSCompat = ((document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false);
		},
	//���ַ����в���Ƕ�׵�NN4 layer
	seekLayer: function(doc,name){
		var elem;
		for(var i = 0; i < doc.layers.length; i++){
				if(doc.layers[i].name == name){
					elem = doc.layers[i];
					break;
					}
				if(doc.layers[i].document.layers.length > 0){
					elem = this.seekLayer(doc.layers[i].document,name)
					if(elem) {break;}
					}
				return elem;

			}
			//����Ҫʱ���뵽Ƕ�׵�NN4 layer
		},
	//��Ԫ�ص������ַ��ܻ��������
	//ת������Ч��Ԫ�ض�������
	getRawObject: function(elemRef){
		var elem;
		if(typeof elemRef == "string"){
			if(this.browserClass.isW3C){
					elem = document.getElementById(elemRef);
				}
			else if(this.browserClass.isIE4){
					elem = document.all(elemRef);
				}
			else if(this.browserClass.isNN4){
					elem = this.seekLayer(document,elemRef);
				}
			}
		else{
			//������������
			elem = elemRef;
			}
		return elem;
		},
	//��Ԫ�ص������ַ��ܻ��������
	//ת������Ч����ʽ����NN4 layer����������
	getStyleObject: function(elemRef){
		var elem = this.getRawObject(elemRef);
		if(elem && this.browserClass.isCSS){
				elem = elem.style;
			}
		return elem;
		},
	//��Ԫ�ض�λ���ض�����������
	moveTo: function(elemRef,x,y){
		var elem = this.getStyleObject(elemRef);
		if(elem){
			if(this.browserClass.isCSS){
					//��������ȷ����ֵ����
					var units = (typeof elem.left == "string") ? "px" : 0;
					elem.left = x + units;
					elem.top = y + units;
				}
			else if(this.browersClass.isNN4){
				elem.moveTo(x,y);
				}
			}
		},
	//��Ԫ���ƶ�X �� / �� Y ��Ԫ��
	moveBy: function(elemRef,deltaX,deltaY){
			var elem = this.getStyleObject(elemRef);
			if(elem){
				if(this.browserClass.isCSS){
					//��������ȷ����ֵ����
					var units = (typeof elem.left == "string") ? "px" : 0;
					if(!isNaN(this.getElementLeft(elemRef))){						
							elem.left = this.getElementLeft(elemRef) + deltaX + units;
							elem.top = this.getElementTop(elemRef) + deltaY + units;
						}
					}
				else if(this.browserClass.isNN4){
							elem.moveBy(deltaX,deltaY);
							}
					}
		},
	//����Ԫ��z-order
	setZIndex: function(obj,zOrder){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.zIndex = zOrder;
			}
		},
	//���ö���ı���ɫ
	setBGColor: function(obj,color){
		var elem = this.getStyleObject(obj);
		if(elem){
			if(this.browserClass.isCSS){
				elem.backgroundColor = color;
				}
			else if(this.browserClass.isNN4){
				elem.bgColor = color;
				}
			}
		},
	//���ö����visibillityΪvisible
	show: function(obj){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.visibility = "visible";
			}
		},
	//���ö����visibilityΪhidden
	hide: function(obj){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.visibility = "hidden";
			}
		},
	//���ؼ�����Ԫ����ʽ����ֵ
	getComputedStyle:function(elemRef,CSSStyleProp){
		var elem = this.getRawObject(elemRef);
		var styleValue,camel;
		if(elem){
			if(document.defaultView && document.defaultView.getComputedStyle){
				var compStyle = document.defaultView.getComputedStyle(elem,'');
				styleValue = compStyle.getPropertyValue(CSSStyleProp);
				}
			else if(elem.currentStyle){
				var IEStyleProp = CSSStyleProp;
				var re = /-\D/;
				while(re.test(IEStyleProp)){
					camel = IEStyleProp.match(re)[0].charAt(1).toUpperCase();
					IEStyleProp = IEStyleProp.replace(re,camel);
					}
				styleValue = elem.currentStyle[IEStyleProp];
				}
			}
			return (styleValue) ? styleValue : null;
		},
	//��ȡ�ɶ�λ�����x����
	getElementLeft: function(elemRef){
		var elem = this.getRawObject(elemRef);
		var result = null;
		if(this.browserClass.isCSS || this.browserClass.isW3C){
			result = parseInt(this.getComputedStyle(elem,"left"));
			}
		else if(this.browserClass.isNN4){
			result = elem.left;
			}
		return result;
		},
	//��ȡ�ɶ�λ�����y����
	getElementTop: function(elemRef){
		var elem = this.getRawObject(elemRef);
		var result = null;
		if(this.browserClass.isCSS || this.browserClass.isW3C){
			result = parseInt(this.getComputedStyle(elem,"top"));
			}
		else if(this.browerClass.isNN4){
			result = elem.top;
			}
		return result;
		},
	//��ȡԪ����Ⱦ��Ŀ���
	getElementWidth: function(elemRef){
		var result = null;
		var elem = this.getRawObject(elemRef);
		if(elem){
			if(elem.offsetWidth){
				if(elem.scrollWidth && (elem.offsetWidth != elem.scrollWidth)){
						result = elem.scrollWidth;
					}
				else{
						result = elem.offsetWidth;
					}
				}
		else if(elem.clip && elem.clip.width){
			result = elem.clip.width;
			}
			}
		return result;
		},
	//��ȡԪ����Ⱦ��ĸ߶�
	getElementHeight: function(elemRef){
		var result = null;
		var elem = this.getRawObject(elemRef);
		if(elem){
				if(elem.offsetHeight){
					result = elem.offsetHeight;
					}
				else if(elem.clip && elem.clip.height){
					result = elem.clip.height;
					}
			}
		return result;
		},
	//����������ڿ������ݿռ�Ŀ���
	getInsideWindowWidth: function(){
		if(window.innerWidth){
			return window.innerWidth;
			}
		else if(this.browserClass.isIECSSCompat){
			return document.body.parentElement.clientWidth;
			}
		else if(document.body && document.body.clientWidth){
			return document.body.clientWidth;
			}
		return null;
		},
	//����������ڿ��ÿռ�ĸ߶�
	getInsideWindowHeight: function(){
		if(window.innerHeight){
			return window.innerHeight;
			}
		else{
				if(document.body.clientHeight != document.body.parentNode.clientHeight){
					 return document.body.parentNode.clientHeight;
					}
				else{
						return document.body.clientHeight;
					}
			}
		return null;
		}
	};