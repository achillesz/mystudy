/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-9-9
 * Time: 下午1:55
 * To change this template use File | Settings | File Templates.
 */
function EventTarget(){
    this.handlers = {}
}
EventTarget.prototype = {
    addHandler: function(type,handler){
        if(typeof this.handlers[type] == "undefined"){
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    },
    fire: function(event){
        if(!event.target){
            event.target = this;
        }
        if(this.handlers[event.type] instanceof Array){
            var handlers = this.handlers[event.type];
            for(var i = 0, len = handlers.length; i < len; i++){
                handlers[i](event);
            }
        }
    },
    removeHandler: function(type,handler){
        if(this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            for(var i = 0, len = handlers.length; i < len; i++){
                if(handlers[i] === handler){
                    break;
                }
            }
            handlers.splice(i,1);
        }
    }
}
var DragDrop = function(){
    var dragdrop = new EventTarget();
    var dragging = null;
    var diffX = 0;
    var diffY = 0;
    var sL = 0;
    var sY = 0;
    function handleEvent(event){
        debugger;
//      获取时间和目标
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
//        确定时间类型
        switch (event.type){
            case "mousedown":
                if(target.className.indexOf("draggable") > -1){
                    dragging = target;
                    sL = document.documentElement.scrollLeft;
                    sY = document.documentElement.scrollTop;
                    diffX = sL + event.clientX - target.offsetLeft;
                    diffY = sY + event.clientY - target.offsetTop;
                    dragdrop.fire({type:"dragstart",target:dragging,x:event.clientX,y:event.clientY});
                }
                break;
            case "mousemove":
                if(dragging !== null){
                    //get event
                    event = EventUtil.getEvent(event);
                    if(sL != document.documentElement.scrollLeft){
                        sL = document.documentElement.scrollLeft;
                    }
                    if(sY != document.documentElement.scrollTop){
                        sY = document.documentElement.scrollTop;
                    }
                    //assign location
                    dragging.style.left = event.clientX +  sL  - diffX + 'px';
                    dragging.style.top = event.clientY + sY - diffY + 'px';
                    dragdrop.fire({type:"drag",target:dragging,x:event.clientX,y:event.clientY})
                }
                break;
            case "mouseup":
                dragdrop.fire({type:"dragend",target:dragging,x:event.clientX,y:event.clientY})
                dragging = null;
                break;
        }


    };
    //公共接口

    dragdrop.enable = function(){
            EventUtil.addHandler(document,"mousedown",handleEvent);
            EventUtil.addHandler(document,"mousemove",handleEvent);
            EventUtil.addHandler(document,'mouseup',handleEvent);
        }

    dragdrop.disable = function(){
            EventUtil.removeHandler(document,"mousedown",handleEvent);
            EventUtil.removeHandler(document,"mousemove",handleEvent);
            EventUtil.removeHandler(document,"mouseup",handleEvent);
        }
    return dragdrop;
}()
















