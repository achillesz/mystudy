//DHTML3API.JS跨平台自定义API
//对象定位，作者Danny Goodman
//Release 3.0。支持NN4，IE, and W3C DOMS.

var DHTMLAPI = {
	browserClass: new Object(),
	init: function(){
		this.browserClass.isCSS = ((document.body && document.body.style) ? true : false);
		this.browserClass.isW3C = ((this.browserClass.isCSS && document.getElementById) ? true : fasle);
		this.browserClass.isIE4 = ((this.browserClass.isCSS && document.all) ? true : false);
		this.browserClass.isNN4 = ((document.layers) ? true : false);
		this.browserClass.isIECSSCompat = ((document.compatMode && document.compatMode.indexOf("CSS1") >= 0) ? true : false);
		},
	//从字符窜中查找嵌套的NN4 layer
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
			//在需要时深入到嵌套的NN4 layer
		},
	//讲元素的名称字符窜活对象引用
	//转换成有效的元素对象引用
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
			//跳过对象引用
			elem = elemRef;
			}
		return elem;
		},
	//将元素的名称字符窜或对象引用
	//转换成有效的样式（或NN4 layer）对象引用
	getStyleObject: function(elemRef){
		var elem = this.getRawObject(elemRef);
		if(elem && this.browserClass.isCSS){
				elem = elem.style;
			}
		return elem;
		},
	//将元素定位到特定的像素坐标
	moveTo: function(elemRef,x,y){
		var elem = this.getStyleObject(elemRef);
		if(elem){
			if(this.browserClass.isCSS){
					//修正不正确的数值类型
					var units = (typeof elem.left == "string") ? "px" : 0;
					elem.left = x + units;
					elem.top = y + units;
				}
			else if(this.browersClass.isNN4){
				elem.moveTo(x,y);
				}
			}
		},
	//讲元素移动X 和 / 或 Y 个元素
	moveBy: function(elemRef,deltaX,deltaY){
			var elem = this.getStyleObject(elemRef);
			if(elem){
				if(this.browserClass.isCSS){
					//修正不正确的数值类型
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
	//设置元素z-order
	setZIndex: function(obj,zOrder){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.zIndex = zOrder;
			}
		},
	//设置对象的背景色
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
	//设置对象的visibillity为visible
	show: function(obj){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.visibility = "visible";
			}
		},
	//设置对象的visibility为hidden
	hide: function(obj){
		var elem = this.getStyleObject(obj);
		if(elem){
			elem.visibility = "hidden";
			}
		},
	//返回计算后的元素样式属性值
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
	//获取可定位对象的x坐标
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
	//获取可定位对象的y坐标
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
	//获取元素渲染后的宽度
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
	//获取元素渲染后的高度
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
	//返回浏览器内可用内容空间的宽度
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
	//返回浏览器内可用空间的高度
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
