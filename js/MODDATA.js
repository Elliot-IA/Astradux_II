var partData = "";
var INVENTORY_FileToMod = 0;

if(partData != ""){
    document.querySelector("meta[name=ModDATA]").setAttribute("content", JSON.stringify(partData));
}
document.querySelector("meta[name=FILETOMOD]").setAttribute("content", JSON.stringify(INVENTORY_FileToMod));