var HX = window.HX = {};
HX.$ = function(element) {
    var el;
    if (typeof element == 'string') el = document.getElementById(element);
    else el = element;
    if (!el) return null;
    else return el;
}
HX.$$ = function(selector, parents) {
    var p = parents || [document];
    if (typeof selector == 'object') return [selector];
    if (typeof selector == 'string') {
        var str = HX.$S.mergeSpace(selector).replace(/\s*>\s*/g, '>').replace(/\s*\+\s*/g, '+').replace(/\s*~\s*/g, '~');
        var arr = str.split(' ');
        HX.$A.each(arr,
        function(a) {
            if (a.indexOf('>') != -1 || a.indexOf('~') != -1) p = HX.$Q.cutLayer(a, p);
            else {
                if (a.indexOf(':') != -1 || a.indexOf('[') != -1) p = HX.$Q.setType(a, p);
                else p = HX.$Q.query(a, p);
            }
        });
        return p;
    }
};
HX.$Q = {
    query: function(selector, parents) {
        var arr = [],
        type = selector.charAt(0);
        if (type == '#') {
            var temp = document.getElementById(selector.replace(/#/, ''));
            arr.push(temp);
        } else if (type == '*') {
            HX.$A.each(parents,
            function(parent) {
                var temp = parent.getElementsByTagName('*');
                var len = temp.length;
                for (var i = 0; i < len; i++) {
                    arr.push(temp[i]);
                }
            });
        } else if (type == '.') {
            HX.$A.each(parents,
            function(parent) {
                var temp = parent.getElementsByTagName('*');
                var len = temp.length;
                for (var i = 0; i < len; i++) {
                    if (temp[i].className && HX.$E.hasClass(temp[i], selector.substr(1))) arr.push(temp[i]);
                }
            });
        } else {
            var tag = selector;
            HX.$A.each(parents,
            function(parent) {
                if (selector.indexOf('.') != -1) {
                    tag = selector.split('.')[0];
                    var classes = selector.split('.')[1];
                }
                var temp = parent.getElementsByTagName(tag);
                var len = temp.length;
                for (var i = 0; i < len; i++) {
                    if (selector.indexOf('.') != -1) {
                        if (temp[i].className && HX.$E.hasClass(temp[i], classes)) arr.push(temp[i]);
                    } else arr.push(temp[i]);
                }
            });
        }
        return arr;
    },
    setType: function(selector, parents) {
        var arr = [];
        if (selector.indexOf(':') != -1) {
            var str = selector.split(':')[0];
            arr = this.cutOrder(selector, this.query(str, parents));
        } else if (selector.indexOf('[') != -1) {
            var str = selector.split('[')[0];
            arr = this.cutAttr(selector, this.query(str, parents));
        }
        return arr;
    },
    cutLayer: function(selector, parents) {
        var arr = [],
        p = parents,
        type = '>';
        if (selector.indexOf('~') != -1) type = '~';
        var s = selector.split(type);
        if (s[0].indexOf(':') != -1 || s[0].indexOf('[') != -1) p = setType(s[0], p);
        else p = this.query(s[0], p);
        HX.$A.each(p,
        function(parent) {
            var a = (type == '>') ? parent.childNodes: parent.parentNode.childNodes;
            len = a.length;
            for (var i = 0; i < len; i++) {
                if (a[i].nodeType == 1) arr.push(a[i]);
            }
        });
        if (s[1].indexOf(':') != -1 || s[1].indexOf('[') != -1) p = this.setType(s[1], arr);
        else p = this.query(s[1], arr);
        return p;
    },
    cutOrder: function(selector, parents) {
        var arr = [];
        if (selector.indexOf(':first') != -1) {
            arr.push(parents[0]);
        } else if (selector.indexOf(':last') != -1) {
            arr.push(parents[parents.length - 1]);
        } else if (selector.indexOf(':even') != -1) {
            HX.$A.each(parents,
            function(parent, i) {
                if (i % 2 == 0) arr.push(parent);
            });
        } else if (selector.indexOf(':odd') != -1) {
            HX.$A.each(parents,
            function(parent, i) {
                if (i % 2 == 1) arr.push(parent);
            });
        } else if (selector.indexOf(':eq') != -1) {
            var reg = /:eq\((\d+)\)/;
            var index = parseInt(reg.exec(selector)[1]);
            arr.push(parents[index]);
        } else if (selector.indexOf(':gt') != -1) {
            var reg = /:gt\((\d+)\)/;
            var index = parseInt(reg.exec(selector)[1]);
            HX.$A.each(parents,
            function(parent, i) {
                if (i > index) arr.push(parent);
            });
        } else if (selector.indexOf(':lt') != -1) {
            var reg = /:lt\((\d+)\)/;
            var index = parseInt(reg.exec(selector)[1]);
            HX.$A.each(parents,
            function(parent, i) {
                if (i < index) arr.push(parent);
            });
        }
        return arr;
    },
    cutAttr: function(selector, parents) {
        var arr = [],
        a_str = selector.substring(selector.indexOf('[') + 1, selector.indexOf(']')),
        attr = [];
        var temp = a_str.split(',');
        for (var i = 0; i < temp.length; i++) {
            var mark = '=';
            if (temp[i].indexOf('!=') != -1) mark = '!=';
            var t = temp[i].split(mark);
            var obj = {};
            obj.name = t[0];
            obj.attr = t[1].replace(/\'|\"/g, '');
            obj.ifno = (mark == '=') ? true: false;
            attr.push(obj);
        }
        HX.$A.each(parents,
        function(parent) {
            for (var i = 0; i < attr.length; i++) {
                if (attr[i].ifno && parent[attr[i].name] && parent[attr[i].name] == attr[i].attr) arr.push(parent);
                if (!attr[i].ifno) arr.push(parent);
            }
        });
        return arr;
    }
};
HX.$B = {
    IE: window.ActiveXObject ? true: false,
    FF: (navigator.userAgent.indexOf('Firefox') >= 0) ? true: false,
    Chrome: (navigator.userAgent.indexOf('Chrome') >= 0) ? true: false,
    Opera: window.opera ? true: false,
    Safari: (navigator.userAgent.indexOf('Safari') >= 0) ? true: false,
    Apple: /\((iPhone|iPad|iPod)/i.test(navigator.userAgent),
    version: function(v) {
        var nav = navigator.userAgent.toLowerCase();
        if (!v) return;
        switch (v) {
        case 'IE':
            return nav.match(/msie ([\d.]+)/)[1];
            break;
        case 'FF':
            return nav.match(/firefox\/([\d.]+)/)[1];
            break;
        case 'Chrome':
            return nav.match(/chrome\/([\d.]+)/)[1];
            break;
        case 'Opera':
            return nav.match(/opera\/([\d.]+)/)[1];
            break;
        case 'Safari':
            return nav.match(/version\/([\d.]+)/)[1];
            break;
        }
    },
    IE6: function() {
        return !! (HX.$B.IE && parseInt(HX.$B.vesion('IE')) < 7)
    }
};
HX.Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    },
    inhert: function(object, fun) {
        return function() {
            return fun.apply(object, arguments);
        }
    },
    inhertEvent: function(object, fun) {
        return function(event) {
            return fun.call(object, (event || window.event));
        }
    },
    Extend: function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
    }
};
HX.Loading = function(url, type, callback, id) {
    if (type == 'img' || type == 'script' || type == 'link') {
        var road = null;
        if (type == 'img') {
            road = new Image();
            road.src = url + '?time=' + new Date().getTime();
        } else {
            road = document.createElement(type);
            if (type == 'script') {
                road.type = 'text/javascript';
                road.src = url;
            }
            if (type == 'link') {
                road.type = 'text/css';
                road.rel = "stylesheet";
                road.href = url;
            }
            document.getElementsByTagName('head')[0].appendChild(road);
        }
        if (typeof id != 'undefined') road.id = id;
        if (road.readyState) {
            road.onreadystatechange = function() {
                if (road.readyState == 'loaded' || road.readyState == 'complete') {
                    road.onreadystatechange = null;
                    callback(road);
                }
            }
        } else {
            road.onload = function() {
                callback(road);
            }
        }
    }
};
HX.jsonp = function(url, callback, jp_no) {
    var url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?');
    var name = 'hxbase_json' + new Date().getTime();
    if (typeof jp_no != 'undefined') name += jp_no;
    url += 'callback=' + name;
    window[name] = callback;
    var road = document.createElement('script');
    road.type = 'text/javascript';
    road.src = url;
    document.getElementsByTagName('head')[0].appendChild(road);
    if (road.readyState) {
        road.onreadystatechange = function() {
            if (road.readyState == 'loaded' || road.readyState == 'complete') {
                road.onreadystatechange = null;
                document.getElementsByTagName('head')[0].removeChild(road);
                window[name] = 'undefined';
                try {
                    delete window[name];
                } catch(e) {}
            }
        }
    } else {
        road.onload = function() {
            document.getElementsByTagName('head')[0].removeChild(road);
            window[name] = 'undefined';
            try {
                delete window[name];
            } catch(e) {}
        }
    }
};
HX.$U = {
    getParams: function() {
        var arr = arguments;
        var value = {};
        var url = location.search;
        if (url.indexOf('?') != -1) {
            var str = url.substr(1);
            if (str.indexOf('&') != -1) {
                var v = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < v.length; j++) {
                        if (arr[i] == v[j].split('=')[0]) value[arr[i]] = v[j].split('=')[1];
                    }
                }
            } else value[str.split('=')[0]] = str.split('=')[1];
        }
        return value;
    },
    getDomain: function() {
        var url = location.hostname;
        return (url.indexOf('www.') != -1) ? url.substr(4) : url;
    }
};
HX.$A = {
    isArray: function(value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    },
    indexOf: function(arr, value) {
        for (var i = 0, il = arr.length; i < il; i++) {
            if (arr[i] == value) return i;
        }
        return - 1;
    },
    each: function(arr, iterator) {
        for (var i = 0, il = arr.length; i < il; i++) {
            var v = iterator(arr[i], i);
        }
    },
    unique: function(arr) {
        var len = arr.length;
        for (var i = 0, il = len; i < il; i++) {
            var it = arr[i];
            for (var j = len - 1; j > i; j--) {
                if (arr[j] == it) arr.splice(j, 1);
            }
        }
        return arr;
    },
    minInt: function(arr) {
        var temp = arr[0];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < temp) temp = arr[i];
        }
        return temp;
    },
    maxInt: function(arr) {
        var temp = arr[0];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] > temp) temp = arr[i];
        }
        return temp;
    },
    removeAt: function(arr, position) {
        var items = [];
        if (position >= arr.length) return;
        else {
            items = arr.slice(0, position).concat(arr.slice(position + 1, arr.length));
            return items;
        }
    },
    makeArray: function(o) {
        if (o == null) return [];
        if (!o.length || typeof o === 'string') return [o];
        var result = [];
        for (var i = 0; i < o.length; i++) result[i] = o[i];
        return result;
    }
};
HX.$S = {
    trim: function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    },
    camelCase: function(str) {
        return str.replace(/-\D/g,
        function(match) {
            return match.charAt(1).toUpperCase();
        });
    },
    hyphenate: function(str) {
        return str.replace(/[A-Z]/g,
        function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        });
    },
    escapeHTML: function(str) {
        return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    },
    removeHTML: function(str) {
        return str.replace(/<\/?[^>]+>/gi, '');
    },
    isUrl: function(str) {
        return (/^(http:|ftp:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/).test(str);
    },
    isNum: function(str, length) {
        return (length ? (str.length == length) : true) && (/^\d*$/.test(str));
    },
    colorHex: function(str) {
        if (/rgb/.test(str)) {
            str = str.replace('rgb(', '').replace(')', '');
            str = HX.$S.trim(str);
            var arr = str.split(',');
            var hex = '#';
            for (var i = 0; i < arr.length; i++) {
                hex += (parseInt(arr[i]).toString(16).length == 1) ? ('0' + parseInt(arr[i]).toString(16)) : parseInt(arr[i]).toString(16);
            }
            return hex;
        }
    },
    colorRgb: function(str) {
        if (/#/.test(str)) {
            var r = parseInt(str.substr(1, 2), 16);
            var g = parseInt(str.substr(3, 2), 16);
            var b = parseInt(str.substr(5, 2), 16);
            var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
            return rgb;
        }
    },
    mergeSpace: function(str) {
        var reg = /\s+/g;
        return HX.$S.trim(str).replace(reg, ' ');
    }
};
HX.$E = {
    bind: function(el, name, fn) {
        var ele = HX.$(el);
        if (ele.attachEvent) ele.attachEvent('on' + name, fn);
        if (ele.addEventListener) ele.addEventListener(name, fn, false);
    },
    unbind: function(el, name, fn) {
        var ele = HX.$(el);
        if (ele.detachEvent) ele.detachEvent('on' + name, fn);
        else ele.removeEventListener(name, fn, false);
    },
    css: function(ele, name, value) {
        var ele = HX.$(ele);
        if (typeof name == 'undefined' && typeof value == 'undefined') {
            return ele.style.cssText;
        } else if (typeof name == 'string' && typeof value == 'undefined') {
            if (name == 'float') name = (HX.$B.IE) ? 'styleFloat': 'cssFloat';
            if (name == 'opacity' && HX.$B.IE && ele.style.filter) return parseFloat(ele.style.filter.replace(/alpha\(opacity=/, '').replace(/\)/, '')) / 100;
            else {
                name = HX.$S.camelCase(name);
                return ele.style[name];
            }
        } else if (typeof name == 'object' && typeof value == 'undefined') {
            var params = name;
            for (var n in params) {
                var param;
                if (n == 'opacity' && HX.$B.IE) {
                    ele.style.filter = 'alpha(opacity=' + parseInt(parseFloat(params[n]) * 100) + ')';
                } else {
                    if (n == 'float') {
                        param = (HX.$B.IE) ? 'styleFloat': 'cssFloat';
                    } else {
                        param = HX.$S.camelCase(n);
                    }
                    ele.style[param] = params[n];
                }
            }
        } else if (typeof name == 'string' && typeof value != 'undefined') {
            if (name == 'float') name = (HX.$B.IE) ? 'styleFloat': 'cssFloat';
            if (name == 'opacity' && HX.$B.IE) ele.style.filter = 'alpha(opacity=' + parseInt(parseFloat(value) * 100) + ')';
            else {
                name = HX.$S.camelCase(name);
                ele.style[name] = value;
            }
        }
    },
    attr: function(el, name, value) {
        var ele = HX.$(el);
        if (typeof value == 'undefined') {
            switch (name) {
            case 'class':
                return ele.className;
            case 'style':
                return ele.style.cssText;
            default:
                return ele.getAttribute(name);
            }
        } else {
            switch (name) {
            case 'class':
                el.className = value;
                break;
            case 'style':
                el.style.cssText = value;
                break;
            default:
                el.setAttribute(name, value);
            }
        }
    },
    prop: function(el, name, value) {
        var ele = HX.$(el);
        if (typeof(value) == 'undefined' && ele[name]) {
            return ele[name];
        } else {
            ele[name] = value;
        }
    },
    text: function(el, value) {
        var ele = HX.$(el);
        return this.prop(ele, typeof ele.innerText != 'undefined' ? 'innerText': 'textContent', value);
    },
    html: function(el, value) {
        var ele = HX.$(el);
        return this.prop(ele, 'innerHTML', value);
    },
    hasClass: function(el, c) {
        var ele = HX.$(el);
        if (ele.className) {
            if (c) {
                return new RegExp('\\b' + HX.$S.trim(c) + '\\b').test(ele.className);
            } else return ele.className;
        }
    },
    addClass: function(el, c) {
        var ele = HX.$(el),
        arr = [];
        if (ele.className) {
            arr = ele.className.split(' ');
            if (HX.$A.indexOf(arr, c) == -1) arr.push(c);
        } else {
            arr.push(c);
        }
        ele.className = arr.join(' ');
    },
    removeClass: function(el, c) {
        var ele = HX.$(el);
        if (ele.className) {
            ele.className = HX.$S.trim(ele.className.replace(new RegExp('\\b' + c + '\\b\\s*', 'g'), ''));
        }
    },
    isElement: function(el) {
        var ele = HX.$(el);
        return !! (ele && ele.nodeType == 1 || ele && ele.nodeType == 11);
    },
    create: function(tag, parent, classes) {
        var newTag = document.createElement(tag);
        parent = (typeof parent != 'undefined' && HX.$E.isElement(parent)) ? HX.$(parent) : document.body;
        if (parent) parent.appendChild(newTag);
        else return null;
        if (typeof classes == 'string') newTag.className = classes;
        return newTag;
    },
    remove: function(ele) {
        var tag = HX.$(ele);
        tag.parentNode.removeChild(tag);
    },
    pos: function(ele) {
        var el = HX.$(ele);
        if (el.parentNode === null || el.style.display == 'none') return false;
        var parent = null,
        pos = [],
        box;
        if (el.getBoundingClientRect) {
            box = el.getBoundingClientRect();
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            return {
                x: box.left + scrollLeft,
                y: box.top + scrollTop
            };
        } else if (document.getBoxObjectFor) {
            box = document.getBoxObjectFor(el);
            var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
            var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
            pos = [box.x - borderLeft, box.y - borderTop];
        } else {
            pos = [el.offsetLeft, el.offsetTop];
            parent = el.offsetParent;
            if (parent != el) {
                while (parent) {
                    pos[0] += parent.offsetLeft;
                    pos[1] += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }
            if (!HX.$B.Opera || (!HX.$B.Safari && e.style.position == 'absolute')) {
                pos[0] -= document.body.offsetLeft;
                pos[1] -= document.body.offsetTop;
            }
        }
        if (el.parentNode) {
            parent = el.parentNode;
        } else {
            parent = null;
        }
        while (parent && parent.tagName.toUpperCase() != 'BODY' && parentName.toUpperCase() != 'HTML') {
            pos[0] -= parent.scrollLeft;
            pos[1] -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } else parent = null;
        }
        return {
            x: pos[0],
            y: pos[1]
        };
    },
    width: function(ele, value) {
        var el = HX.$(ele);
        if (typeof value == 'undefined') {
            return el.offsetWidth;
        } else return HX.$E.css(el, 'width', value + 'px');
    },
    height: function(ele, value) {
        var el = HX.$(ele);
        if (typeof value == 'undefined') {
            return el.offsetHeight;
        } else return HX.$E.css(el, 'height', value + 'px');
    },
    left: function(ele, value) {
        var el = HX.$(ele);
        if (typeof value == 'undefined') {
            return HX.$E.pos(el).x;
        } else return HX.$E.css(el, 'left', value + 'px');
    },
    top: function(ele, value) {
        var el = HX.$(ele);
        if (typeof value == 'undefined') {
            return HX.$E.pos(el).y;
        } else return HX.$E.css(el, 'top', value + 'px');
    },
    show: function(ele, val) {
        var el = HX.$(ele);
        HX.$E.css(el, 'display', val ? val: '');
        return el;
    },
    hide: function(ele) {
        var el = HX.$(ele);
        HX.$E.css(el, 'display', 'none');
        return el;
    },
    toggle: function(ele) {
        var el = HX.$(ele);
        HX.$E[HX.$E.css(el, 'display') == 'none' ? 'show': 'hide'](el);
        return el;
    },
    clearWhite: function(ele) {
        var el = HX.$(ele);
        var node = el.firstChild;
        while (node) {
            var nextNode = node.nextSibling;
            if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) el.removeChild(node);
            node = nextNode;
        }
        return el;
    }
};
HX.$V = {
    bind: function(ele, name, fn) {
        if (ele.attachEvent) {
            ele['e' + name + fn] = fn;
            ele[name + fn] = function() {
                ele['e' + name + fn](window.event);
            }
            ele.attachEvent('on' + name, ele[name + fn]);
        } else ele.addEventListener(name, fn, false);
    },
    unbind: function(ele, name, fn) {
        if (ele.detachEvent) {
            ele.detachEvent('on' + name, ele[name + fn]);
            ele[name + fn] = null;
        } else ele.removeEventListener(name, fn, false);
    },
    cancelEventUp: function() {
        if (HX.$B.IE) window.event.cancelBubble = true;
        else {
            var e = HX.$V.searchEvent();
            e.stopPropagation();
        }
    },
    searchEvent: function() {
        var func = HX.$V.searchEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if (arg0.constructor == Event || arg0.constructor == MouseEvent) return arg0;
            }
            func = func.caller;
        }
        return null;
    },
    hover: function(ele, classes) {
        var el = HX.$(ele);
        HX.$V.bind(el, 'mouseover',
        function() {
            var _this = this;
            HX.$E.addClass(_this, classes);
        });
        HX.$V.bind(el, 'mouseout',
        function() {
            var _this = this;
            HX.$E.removeClass(_this, classes);
        });
    },
    ready: function(func, win, doc) {
        var win = win || window;
        var doc = doc || document;
        var loaded = false;
        var readyFunc = function() {
            if (loaded) return;
            loaded = true;
            func();
        };
        if (doc.addEventListener) {
            this.bind(doc, 'DOMContentLoaded', readyFunc);
        } else if (doc.attachEvent) {
            this.bind(doc, 'readystatechange',
            function() {
                if (doc.readyState == 'complete' || doc.readyState == 'loaded') readyFunc();
            });
            if (doc.documentElement.doScroll && typeof win.frameElement === 'undefined') {
                var ieReadyFunc = function() {
                    if (loaded) return;
                    try {
                        doc.documentElement.doScroll('left');
                    } catch(e) {
                        window.setTimeout(ieReadyFunc, 0);
                        return;
                    }
                    readyFunc();
                };
                ieReadyFunc();
            }
        }
        this.bind(win, 'load', readyFunc);
    }
};
HX.Cookie = {
    get: function(name) {
        var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");
        if ((tmp = reg.exec(unescape(document.cookie)))) return (tmp[2]);
        return null;
    },
    set: function(name, value, expires, path, domain) {
        var str = name + "=" + escape(value);
        if (expires != null || expires != '') {
            if (expires == 0) {
                expires = 100 * 365 * 24 * 60;
            }
            var exp = new Date();
            exp.setTime(exp.getTime() + expires * 60 * 1000);
            str += "; expires=" + exp.toGMTString();
        }
        if (path) {
            str += "; path=" + path;
        }
        if (domain) {
            str += "; domain=" + domain;
        }
        document.cookie = str;
    },
    del: function(name, path, domain) {
        document.cookie = name + "=" + ((path) ? "; path=" + path: "") + ((domain) ? "; domain=" + domain: "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};
HX.Tab = function(options) {
    this.options = {
        pId: '',
        tag: '',
        classes: 'on',
        ename: 'click',
        ifcon: true,
        more: false,
        delay: 0,
        callback: function() {}
    };
    HX.Class.Extend(this.options, options || {});
    var timer = null;
    if (this.options.pId == '' && !HX.$A.isArray(this.options.tag) && ifcon) return;
    var arr = [];
    if (HX.$A.isArray(this.options.tag)) arr = this.options.tag;
    else arr = HX.$(this.options.pId).getElementsByTagName(this.options.tag);
    if (arr.length <= 1) return;
    var _this = this;
    for (var i = 0; i < arr.length; i++) {
        arr[i]['on' + this.options.ename] = (function(i) {
            return function() {
                _this.dealTag(i);
            }
        })(i);
    }
    this.dealTag = function(i) {
        if (this.options.delay == 0) {
            this.clearTag();
            HX.$E.addClass(arr[i], this.options.classes);
            if (this.options.ifcon && HX.$(this.options.pId + '_con' + i)) HX.$(this.options.pId + '_con' + i).style.display = '';
            if (this.options.more && HX.$(this.options.pId + '_more' + i)) HX.$(this.options.pId + '_more' + i).style.display = '';
            if (typeof this.options.callback == 'function') this.options.callback(i);
        } else {
            timer = setTimeout(function() {
                clearTimeout(timer);
                _this.clearTag();
                HX.$E.addClass(arr[i], _this.options.classes);
                if (_this.options.ifcon && HX.$(_this.options.pId + '_con' + i)) HX.$(_this.options.pId + '_con' + i).style.display = '';
                if (_this.options.more && HX.$(_this.options.pId + '_more' + i)) HX.$(_this.options.pId + '_more' + i).style.display = '';
                if (typeof _this.options.callback == 'function') _this.options.callback(i);
            },
            _this.options.delay);
        }
    };
    this.clearTag = function() {
        for (var i = 0; i < arr.length; i++) {
            HX.$E.removeClass(arr[i], this.options.classes);
            if (this.options.ifcon && HX.$(this.options.pId + '_con' + i)) HX.$(this.options.pId + '_con' + i).style.display = 'none';
            if (this.options.more && HX.$(this.options.pId + '_more' + i)) HX.$(this.options.pId + '_more' + i).style.display = 'none';
        }
    };
};
HX.Scroll = {
    gapScroll: function(objId, options) {
        var scrollObj = HX.$(objId);
        var contrainer = scrollObj.parentNode;
        options = options || {};
        var gap = parseInt(options.gap) || 2000;
        var frame = parseInt(options.frame) || 20;
        var distance = parseInt(options.distance) || 22;
        var vate = parseFloat(options.vate) || 0.05;
        var direction = options.direction || 'scrollTop';
        var control = options.control || false;
        var preObj = HX.$(options.preId) || '';
        var nextObj = HX.$(options.nextId) || '';
        var ename = options.ename || 'click';
        var auto = (typeof options.auto != 'undefined') ? options.auto: true;
        var maxLength = HX.Scroll.pack(scrollObj, direction);
        var mark = 0,
        timer, gap_timer, l = Math.floor(maxLength / distance);
        var toggle = false;
        if (auto) timer = setTimeout(goto, gap);
        function goto() {
            mark += 1;
            gap_timer = setInterval(plus, frame);
        }
        function plus() {
            clearTimeout(timer);
            var d = contrainer[direction];
            if (d < mark * distance) contrainer[direction] = Math.ceil(d + (mark * distance - d) * vate);
            else {
                clearInterval(gap_timer);
                mark = mark < l ? mark: 0;
                contrainer[direction] = mark * distance;
                if (!toggle && auto) timer = setTimeout(goto, gap);
            }
        }
        function minus() {
            clearTimeout(timer);
            var d = contrainer[direction];
            if (d > mark * distance) contrainer[direction] = Math.floor(d - (d - mark * distance) * vate);
            else {
                clearInterval(gap_timer);
                mark = mark < 1 ? l: mark;
                contrainer[direction] = mark * distance;
                if (!toggle && auto) timer = setTimeout(goto, gap);
            }
        }
        if (control && preObj != '' && nextObj != '') {
            nextObj['on' + ename] = function() {
                clearInterval(gap_timer);
                mark = mark < l ? mark: 0;
                contrainer[direction] = mark * distance;
                goto();
            }
            preObj['on' + ename] = function() {
                clearInterval(gap_timer);
                mark = mark < 1 ? l: mark;
                contrainer[direction] = mark * distance;
                mark -= 1;
                gap_timer = setInterval(minus, frame);
            }
        }
        scrollObj.onmouseover = function() {
            toggle = true;
            clearTimeout(timer);
        }
        scrollObj.onmouseout = function() {
            toggle = false;
            if (auto) timer = setTimeout(goto, gap);
        }
    },
    continuScroll: function(objId, options) {
        var scrollObj = HX.$(objId);
        var contrainer = scrollObj.parentNode;
        options = options || {};
        var frame = parseInt(options.frame) || 40;
        var direction = options.direction || 'scrollTop';
        var control = options.control || false;
        var preObj = HX.$(options.preId) || '';
        var nextObj = HX.$(options.nextId) || '';
        var ename = options.ename || 'click';
        var maxLength = HX.Scroll.pack(scrollObj, direction, control);
        var timer = setInterval(plus, frame);
        function plus() {
            var d = contrainer[direction];
            if (d < maxLength) contrainer[direction] = d + 1;
            else contrainer[direction] = 0;
        }
        function minus() {
            var d = contrainer[direction];
            if (d > maxLength) contrainer[direction] = d - 1;
            else contrainer[direction] = 2 * maxLength;
        }
        if (control && preObj != '' && nextObj != '') {
            preObj['on' + ename] = function() {
                clearInterval(timer);
                contrainer[direction] = (contrainer[direction] > maxLength) ? (contrainer[direction] - maxLength) : contrainer[direction];
                timer = setInterval(plus, frame);
            }
            nextObj['on' + ename] = function() {
                clearInterval(timer);
                contrainer[direction] = (contrainer[direction] < maxLength) ? (contrainer[direction] + maxLength) : contrainer[direction];
                timer = setInterval(minus, frame);
            }
        }
        scrollObj.onmouseover = function() {
            clearInterval(timer);
        }
        scrollObj.onmouseout = function() {
            timer = (contrainer[direction] < maxLength) ? setInterval(plus, frame) : setInterval(minus, frame);
        }
    },
    pack: function(obj, type, control) {
        var temp = obj.innerHTML;
        obj.innerHTML = '';
        var span = document.createElement('span');
        obj.appendChild(span);
        span.innerHTML = temp;
        span.style.styleFloat = 'left';
        span.style.cssFloat = 'left';
        var len = (type == 'scrollTop') ? span.offsetHeight: span.offsetWidth;
        span.innerHTML += temp;
        if (typeof control != 'undefined' && control == true) span.innerHTML += temp;
        return len;
    }
};
HX.Drag = new HX.Class.create();
HX.Drag.prototype = {
    initialize: function(drag, options) {
        this.drag = HX.$(drag);
        this._x = this._y = 0;
        this.FM = HX.Class.inhertEvent(this, this.Move);
        this.FS = HX.Class.inhert(this, this.Stop);
        this.setDefault(options);
        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxBottom = parseInt(this.options.mxBottom);
        this.LockX = !!this.options.LockX;
        this.LockY = !!this.options.LockY;
        this.Lock = !!this.options.Lock;
        this.conLimit = !!this.options.conLimit;
        this.repairX = this.options.repairX;
        this.repairY = this.options.repairY;
        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;
        this.Handle = HX.$(this.options.Handle) || this.drag;
        this.drag.style.position = 'absolute';
        this.eventStart = HX.$B.Apple ? 'touchstart': 'mousedown';
        this.eventMove = HX.$B.Apple ? 'touchmove': 'mousemove';
        this.eventEnd = HX.$B.Apple ? 'touchend': 'mouseup';
        if (this.options.e == null) HX.$E.bind(this.Handle, this.eventStart, HX.Class.inhertEvent(this, this.Start));
        else this.Start(this.options.e);
    },
    setDefault: function(options) {
        this.options = {
            Handle: '',
            Limit: false,
            mxLeft: 0,
            mxTop: 0,
            mxRight: 9999,
            mxBottom: 9999,
            Lock: false,
            LockX: false,
            LockY: false,
            conLimit: false,
            repairX: 0,
            repairY: 0,
            e: null,
            onStart: function() {},
            onMove: function() {},
            onStop: function() {}
        };
        HX.Class.Extend(this.options, options || {});
    },
    Start: function(oEvent) {
        if (this.Lock) return;
        this._x = HX.$B.Apple ? (oEvent.targetTouches[0].clientX - this.drag.offsetLeft) : (oEvent.clientX - this.drag.offsetLeft);
        this._y = HX.$B.Apple ? (oEvent.targetTouches[0].clientY - this.drag.offsetTop) : (oEvent.clientY - this.drag.offsetTop);
        HX.$E.bind(document, this.eventMove, this.FM);
        HX.$E.bind(document, this.eventEnd, this.FS);
        if (HX.$B.IE) {
            HX.$E.bind(this.Handle, 'losecapture', this.FS);
            this.Handle.setCapture();
        } else {
            HX.$E.bind(window, 'blur', this.FS);
            oEvent.preventDefault();
        }
        this.onStart();
    },
    Move: function(oEvent) {
        if (this.Lock) {
            this.Stop();
            return;
        };
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        var vLeft = HX.$B.Apple ? (oEvent.targetTouches[0].clientX - this._x) : (oEvent.clientX - this._x),
        vTop = HX.$B.Apple ? (oEvent.targetTouches[0].clientY - this._y) : (oEvent.clientY - this._y);
        if (this.Limit) {
            vLeft = Math.max(Math.min(vLeft, this.mxRight - this.drag.offsetWidth), this.mxLeft);
            vTop = Math.max(Math.min(vTop, this.mxBottom - this.drag.offsetHeight), this.mxTop);
        }
        if (!this.LockX) this.drag.style.left = (HX.$B.IE && this.conLimit) ? (vLeft + this.repairX + "px") : (vLeft + "px");
        if (!this.LockY) this.drag.style.top = (HX.$B.IE && this.conLimit) ? (vTop + this.repairY + "px") : (vTop + "px");
        this.onMove();
    },
    Stop: function() {
        HX.$E.unbind(document, this.eventMove, this.FM);
        HX.$E.unbind(document, this.eventEnd, this.FS);
        if (HX.$B.IE) {
            HX.$E.unbind(this.Handle, "losecapture", this.FS);
            this.Handle.releaseCapture();
        } else {
            HX.$E.unbind(window, "blur", this.FS);
        };
        this.onStop();
    }
};
HX.Ajax = new HX.Class.create();
HX.Ajax.prototype = {
    initialize: function(url, options) {
        this.http = this.createXMLHttpRequest();
        this.url = url;
        this.setDefault(options);
    },
    setDefault: function(options) {
        this.options = {
            method: 'get',
            async: true,
            data: null,
            format: 'json',
            encode: 'UTF-8',
            success: function() {},
            failure: function() {}
        };
        HX.Class.Extend(this.options, options || {});
    },
    ajax: function() {
        var http = this.http;
        var url = this.url;
        var options = this.options;
        http.open(options.method, url, options.async);
        if (options.method == 'get' && typeof(options.data) == 'string') {
            url += (url.indexOf('?') == -1 ? '?': '&') + options.data;
            options.data = null;
        }
        if (options.method == 'post') {
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=' + options.encode);
        }
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                var temp = http;
                if (typeof options.format == 'string') {
                    switch (options.format) {
                    case 'text':
                        temp = http.responseText;
                        break;
                    case 'json':
                        temp = eval('(' + http.responseText + ')');
                        break;
                    case 'xml':
                        temp = http.responseXML;
                        break;
                    }
                    options.success(temp);
                } else options.failure();
            }
        };
        http.send(options.data || null);
    },
    text: function() {
        this.options.format = 'text';
        return this.ajax();
    },
    json: function() {
        this.options.format = 'json';
        return this.ajax();
    },
    xml: function() {
        this.options.format = 'xml';
        return this.ajax();
    },
    createXMLHttpRequest: function() {
        if (window.XMLHttpRequest) return new XMLHttpRequest();
        else {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch(e) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch(e) {
                    return false;
                }
            }
        }
    }
};
HX.Animator = new HX.Class.create();
HX.Animator.prototype = {
    initialize: function(options) {
        this.setDefault(options);
        this.subjects = [];
        this.state = 0;
        this.target = 0;
        this.lastTime = null;
        var _this = this;
        this.timer = function() {
            _this.timerEvent();
        };
    },
    setDefault: function(options) {
        this.options = {
            frame: 20,
            duration: 400,
            transition: HX.Animator.tx.easeInOut,
            onComplete: function() {},
            onMove: function() {}
        };
        HX.Class.Extend(this.options, options || {});
    },
    toggle: function() {
        this.seekTo(1 - this.target);
    },
    seekTo: function(to) {
        this.seekFromTo(this.state, to);
    },
    seekFromTo: function(from, to) {
        this.target = Math.max(0, Math.min(1, to));
        this.state = Math.max(0, Math.min(1, from));
        this.lastTime = new Date().getTime();
        if (!this.intervalId) this.intervalId = setInterval(this.timer, this.options.frame);
    },
    timerEvent: function() {
        var now = new Date().getTime();
        var timePassed = now - this.lastTime;
        this.lastTime = now;
        var movement = (timePassed / this.options.duration) * (this.state < this.target ? 1 : -1);
        if (Math.abs(movement) >= Math.abs(this.state - this.target)) {
            this.state = this.target;
        } else {
            this.state += movement;
        }
        try {
            this.propagate();
        } finally {
            this.options.onMove.call(this);
            if (this.target == this.state) {
                window.clearInterval(this.intervalId);
                this.intervalId = null;
                this.options.onComplete.call(this);
            }
        }
    },
    propagate: function() {
        var value = this.options.transition(this.state);
        for (var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].setState) {
                this.subjects[i].setState(value);
            } else {
                this.subjects[i](value);
            }
        }
    },
    addSubject: function(subject) {
        this.subjects[this.subjects.length] = subject;
        return this;
    }
};
HX.Animator.makeEaseIn = function(a) {
    return function(state) {
        return Math.pow(state, a * 2);
    }
};
HX.Animator.makeEaseOut = function(a) {
    return function(state) {
        return 1 - Math.pow(1 - state, a * 2);
    }
};
HX.Animator.makeElastic = function(bounces) {
    return function(state) {
        state = HX.Animator.tx.easeInOut(state);
        return ((1 - Math.cos(state * Math.PI * bounces)) * (1 - state)) + state;
    }
};
HX.Animator.makeBounce = function(bounces) {
    var fn = HX.Animator.makeElastic(bounces);
    return function(state) {
        state = fn(state);
        return state <= 1 ? state: 2 - state;
    }
};
HX.Animator.makeADSR = function(attackEnd, decayEnd, sustainEnd, sustainLevel) {
    if (sustainLevel == null) sustainLevel = 0.5;
    return function(state) {
        if (state < attackEnd) {
            return state / attackEnd;
        }
        if (state < decayEnd) {
            return 1 - ((state - attackEnd) / (decayEnd - attackEnd) * (1 - sustainLevel));
        }
        if (state < sustainEnd) {
            return sustainLevel;
        }
        return sustainLevel * (1 - ((state - sustainEnd) / (1 - sustainEnd)));
    }
};
HX.Animator.tx = {
    easeInOut: function(pos) {
        return (( - Math.cos(pos * Math.PI) / 2) + 0.5);
    },
    linear: function(x) {
        return x;
    },
    easeIn: HX.Animator.makeEaseIn(1.5),
    easeOut: HX.Animator.makeEaseOut(1.5),
    strongEaseIn: HX.Animator.makeEaseIn(2.5),
    strongEaseOut: HX.Animator.makeEaseOut(2.5),
    elastic: HX.Animator.makeElastic(1),
    veryElastic: HX.Animator.makeElastic(3),
    bouncy: HX.Animator.makeBounce(1),
    veryBouncy: HX.Animator.makeBounce(3)
};
function NumSubject(eles, property, from, to, units) {
    this.eles = HX.$A.makeArray(eles);
    if (property == 'opacity' && window.ActiveXObject) {
        this.property = 'filter';
    } else {
        this.property = HX.$S.camelCase(property);
    }
    this.from = parseFloat(from);
    this.to = parseFloat(to);
    this.units = ((typeof units != 'undefined') && (units != null)) ? units: 'px';
}
NumSubject.prototype = {
    setState: function(state) {
        var style = this.getStyle(state);
        var visibility = (this.property == 'opacity' && state == 0) ? 'hidden': '';
        var j = 0;
        for (var i = 0; i < this.eles.length; i++) {
            try {
                this.eles[i].style[this.property] = style;
            } catch(e) {
                if (this.property != 'fontWeight') throw e;
            }
            if (j++>20) return;
        }
    },
    getStyle: function(state) {
        state = this.from + ((this.to - this.from) * state);
        if (this.property == 'filter') return "alpha(opacity=" + Math.round(state * 100) + ")";
        if (this.property == 'opacity') return state;
        return Math.round(state) + this.units;
    }
};
function ColorSubject(eles, property, from, to) {
    this.eles = HX.$A.makeArray(eles);
    this.property = HX.$S.camelCase(property);
    this.to = this.expandColor(to);
    this.from = this.expandColor(from);
    this.origFrom = from;
    this.origTo = to;
}
ColorSubject.prototype = {
    expandColor: function(color) {
        var hexColor, red, green, blue;
        hexColor = ColorSubject.parseColor(color);
        if (hexColor) {
            red = parseInt(hexColor.slice(1, 3), 16);
            green = parseInt(hexColor.slice(3, 5), 16);
            blue = parseInt(hexColor.slice(5, 7), 16);
            return [red, green, blue];
        }
        if (window.DEBUG) {
            alert("Invalid colour: '" + color + "'");
        }
    },
    getValueForState: function(color, state) {
        return Math.round(this.from[color] + ((this.to[color] - this.from[color]) * state));
    },
    setState: function(state) {
        var color = '#' + ColorSubject.toColorPart(this.getValueForState(0, state)) + ColorSubject.toColorPart(this.getValueForState(1, state)) + ColorSubject.toColorPart(this.getValueForState(2, state));
        for (var i = 0; i < this.eles.length; i++) {
            this.eles[i].style[this.property] = color;
        }
    }
};
ColorSubject.parseColor = function(str) {
    var color = '#',
    match;
    if (match = ColorSubject.rgbReg.exec(str)) {
        var part;
        for (var i = 1; i <= 3; i++) {
            part = Math.max(0, Math.min(255, parseInt(match[i])));
            color += ColorSubject.toColorPart(part);
        }
        return color;
    }
    if (match = ColorSubject.hexReg.exec(str)) {
        if (match[1].length == 3) {
            for (var i = 0; i < 3; i++) {
                color += match[1].charAt(i) + match[1].charAt(i);
            }
            return color;
        }
        return '#' + match[1];
    }
    return false;
};
ColorSubject.toColorPart = function(number) {
    if (number > 255) number = 255;
    var digits = number.toString(16);
    if (number < 16) return '0' + digits;
    return digits;
};
ColorSubject.rgbReg = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorSubject.hexReg = /^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;