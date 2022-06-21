var device = "webpage";

function addEl(type, id, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    $(appendSelector)[0].appendChild(el);
}
function addEl(type, id, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    $(appendSelector)[0].appendChild(el);
}
function addEl(type, id, className, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    el.className = className;
    $(appendSelector)[0].appendChild(el);
}