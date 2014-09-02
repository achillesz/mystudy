/**
 * Created with JetBrains WebStorm.
 * User: wang zhiyong
 * Date: 12-10-24
 * Time: 下午10:53
 * To change this template use File | Settings | File Templates.
 */
/*以一个对象的x和y属性返回滚动条的偏移量*/
function getScrollOffsets(w){
    w = w || window;
    //除了IE8以及更早的版本以外，其他浏览器都能用
    if(w.pageXOffset != null){
        return {x:w.pageXOffset,y:w.pageYOffset};
    }
    //对标准模式的IE（或任何浏览器）
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {x:d.documentElement.scrollLeft,y:d.documentElement.scrollTop}
    }
    //对怪异模式下的浏览器
    return {x:d.body.scrollLeft, y:d.body.scrollTop};
}
/*查询窗口的市口尺寸*/
function getViewportSize(w){
    w = w || window;

    if(window.innerWidth != null) return {w:w.innerWidth,h:w.innerHeight}

    var d = w.document;
    if(document.compatMode == "CSS1Compat") return {w:d.documentElement.clientWidth,h:d.documentElement.clientHeight};


    return {w:d.body.clientWidth, h:d.body.clientHeight}

}

function getElementPosition(e){
    var x = 0, y = 0;
    while(e != null){
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return {x:x,y:y}
}
function getElementPos(elt){
    var x = 0,y = 0;
    for(var e = elt; e != null; e = e.offsetParent){
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    for(var e = elt.parentNode; e != null && e.nodeType == 1; e = e.parentNode){
        x -= e.scrollLeft;
        y -= e.scrollTop;
    }
    return {x:x,y:y}
}
