var Dom = {
			$:function(){
				var elements = new Array();
				for(var i = 0,len = arguments.length; i < len; i++){
						var element = arguments[i];
						if(typeof element == 'string'){
							element = document.getElementById(element);
							}
						if(arguments.length == 1) return element;
						elements.push(element);
					}
				return elements;
				},
			getClass:function(className,tag,parent){
				var parent = parent || document;
				if(!(parent = Dom.$(parent))) return false;
				tag = tag || '*';
				var tags = parent.getElementsByTagName(tag);
				className = className.replace(/\-/g,'\\-');
				var matchingElements = new Array();
				var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
				var element;
				for(var i = 0,len = tags.length; i < len; i++){
					element = tags[i];
					if(regex.test(element.className)){
						matchingElements.push(element);
						}
					}
				return matchingElements;
				},
			toggleDisplay:function(node,value){
				if(!(node =Dom.$(node))){ return false}
				if(node.style.display != 'none'){
					node.style.display = 'none';
					}
				else{
					node.style.display = value || '';
					}
				return true;
				},
			removeChildren:function(parent){
				if(!(parent = Dom.$(parent))) return false;
				while(parent.firstChild){
					parent.firstChild.parentNode.removeChild(parent.firstChild);
					}
				return parent;
				},
			prependChild:function(parent,newChild){
				if(!(parent = Dom.$(parent))) return false;
				if(!(newChild = Dom.$(newChild))) return false;
				if(parent.firstChild){
					parent.insertBefore(newChild,parent.firstChild);
					}
				else{
					parent.appendChild(newChild);
					}
				return parent;
				},
			insertAfter:function(node,referenceNode){
				if(!(node = Dom.$(node))) return false;
				if(!(referenceNode = Dom.$(referenceNode))) return false;
				return referenceNode.parentNode.insertBefore(node,referenceNode.nextSibling);
				}
		}