var EventUtil = {
    getEvent: function(event) {
        return event ? event: window.event;
    },
    getTarget: function(event) {
        return target = event.target || event.srcElement;
    },
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        }
        else if (event.type != 'mouseover' && event.toElement) {
            return event.toElement;
        }
        else if (event.type == 'mouseover' && event.fromElement) {
            return event.fromElement;
        }
        else {
            return null;
        }
    },
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else if (element.attachEvent) {


            element.attachEvent('on' + type, handler);
        }
        else {
            element['on' + type] = handler;
        }
    },
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        }
        else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        }
        else {
            element['on' + type] = null;
        }
    },
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true;
        }
    },
    getClientCorrds: function(event) {
        return {
            x: event.clientX,
            y: event.clientY
        }
    },
    getScreenCorrds: function(event) {
        return {
            x: event.screenX,
            y: event.screenY
        };
    },
    getCharCode: function(event) {
        if (typeof event.charCode == 'number') {
            return event.charCode;
        }
        else {
            return event.keyCode
        }
    }
};