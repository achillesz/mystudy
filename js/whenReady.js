/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-10-7
 * Time: ����7:40
 * To change this template use File | Settings | File Templates.
 */
var whenReady = ((function(){
    var funcs = [];
    var ready = false;
    function handler(e){
        if(ready) return;
        if(e.type === "readystatechange" && document.readyState !== "complete") return;
        for(var i = 0; i < funcs.length; i++){
            funcs[i].call(document);
        }
        ready = true;
        funcs = null;
    }
    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",handler,false);
        document.addEventListener("readystatechange",handler,false);
        window.addEventListener("load",handler,false);
    }
    else if(document.attachEvent){
        document.attachEvent("onreadystatechange",handler);
        window.attachEvent("onload",handler);
    }
    return function whenReady(f){
        if(ready) f.call(document);
        else funcs.push(f)
    }
})());
