/**
 * Created with JetBrains WebStorm.
 * User: wang zhiyong
 * Date: 12-10-24
 * Time: ����10:53
 * To change this template use File | Settings | File Templates.
 */
/*��һ�������x��y���Է��ع�������ƫ����*/
function getScrollOffsets(w){
    w = w || window;
    //����IE8�Լ�����İ汾���⣬���������������
    if(w.pageXOffset != null){
        return {x:w.pageXOffset,y:w.pageYOffset};
    }
    //�Ա�׼ģʽ��IE�����κ��������
    var d = w.document;
    if(document.compatMode == "CSS1Compat"){
        return {x:d.documentElement.scrollLeft,y:d.documentElement.scrollTop}
    }
    //�Թ���ģʽ�µ������
    return {x:d.body.scrollLeft, y:d.body.scrollTop};
}
/*��ѯ���ڵ��пڳߴ�*/
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
