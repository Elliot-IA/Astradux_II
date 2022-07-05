var showingSearchResults = false;
var device = "webpage";

function addEl(type, id, className, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    el.className = className;
    $(appendSelector)[0].appendChild(el);
}

var POST_paramObj = {};
function submitPost(){
    if(device == "webpage"){
        
    }else{
        $.post(pageName, POST_paramObj /*{ command: "resetSEARCHQUERY", data: "[\"\",\"\"]" }*/ );
    }
}
function a(id){
    return $("#"+id)[0];
}
function b(cl){
    return [...$("."+cl)];
}

function c(id, ev, func){
    $("#"+id)[0].addEventListener(ev,func);
}