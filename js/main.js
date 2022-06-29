//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// This file handles:
//      >Transfering the Inventory file data into the Inventory array 
//      >Displaying the Inventory[] as scales
//      >Building the partView
//      >Manipulating part data from partView
//      >a to addPart
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.log("main.js File Initated");

var Inventory = [];

var INVENTORYFiles_Count = parseInt(document.querySelector("meta[name=fileCountDATA]").getAttribute("content"));
var INVENTORYFiles_CycleOrder = [];
var INVENTORYFiles_CyclesRun = 0;
var cycleComplete = false;
var tilesLoaded = 0;
var inventoryLoc = 0;
var showingSearchResults = false;
var showingResultIndex = 0;
var loadDelay = 500;
var forignSearchDelay = 500;

window.onload = function(){
    createAndShuffle_CycleOrder();

    if(document.querySelector("meta[name=queryDATA]").getAttribute("content") != "[\"\",\"\"]"){
        console.log("Running forign search...");
        var forignQuery = eval(eval(document.querySelector("meta[name=queryDATA]").getAttribute("content")));
        document.getElementById("inquiry").value = forignQuery[0];
        if(forignQuery[1] == ""){
            setTimeout(()=>{
                fullSearch();
            }, forignSearchDelay);
        }else if(forignQuery[1] == "catagory"){
            setTimeout(()=>{
                catSearch();
            }, forignSearchDelay);
        }else{
            alert("main.js found non-null queryDATA with an unrecognized search type");
        }
        console.log("Reseting SEARCHQUERY.js...");
        document.getElementById("command_hiddenInput").value = "resetSEARCHQUERY";
        document.getElementById("data_hiddenInput").value = "[\"\",\"\"]";
        document.getElementById("hiddenForm").submit();
    }else{
        $("#loadingInventoryFileMessage")[0].style.display = "block";
        loadAndTileifyFrag(INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun], "Inventory");
    }

    document.getElementById("inquiry").addEventListener('click', function(){        //Clears the search box when pressed
        document.getElementById("inquiry").value = "";
    });
    document.getElementById("zoomImgCurtain").addEventListener('click', ()=>{zoomImg()});
    document.getElementById("zoomImg").addEventListener('click', ()=>{zoomImg()});
    document.getElementById("retrievedImg").addEventListener('click', ()=>{zoomImg()});
    document.getElementById("outofstockOverlayImg").addEventListener('click', ()=>{zoomImg()});
    document.getElementById("leftPointer").addEventListener("mousedown", function(){
        scrollLeft_superFunc();
    });
    document.getElementById("rightPointer").addEventListener("mousedown", function(){
        scrollRight_superFunc();
    });
    document.getElementById("leftPointer").addEventListener("mouseup", function(){
        document.getElementById("leftPointer").src = "Images/leftPointer.png";
        if(showingSearchResults){
            if(eval(partCarousel).indexOf(eval(inventoryLoc)) == 0){
                document.getElementById("leftPointer").style.display="none";
            }
        }else{
            if(inventoryLoc == 0){
                document.getElementById("leftPointer").style.display="none";
            }
        }
    });
    document.getElementById("rightPointer").addEventListener("mouseup", function(){
        document.getElementById("rightPointer").src = "Images/rightPointer.png";
        if(showingSearchResults){
            if(eval(partCarousel).indexOf(eval(inventoryLoc)) == eval(partCarousel).length-1){
                document.getElementById("rightPointer").style.display="none";
            }
        }else{
            if(inventoryLoc == Inventory.length-1){
                document.getElementById("rightPointer").style.display="none";
            }
        }
    });

    document.getElementById("loadPartsButton").addEventListener("click", ()=>{
        loadAndTileifyFrag(INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun], "Inventory");
        $("#loadingInventoryFileMessage")[0].style.display = "block";
        console.log("Next Inventory Fragment added to Inventory Array");
    });

    $("#submitLocTransfereButton")[0].addEventListener("click",()=>{
        document.getElementById("command_hiddenInput").value = "transfereLoc";
        document.getElementById("data_hiddenInput").value = $("#transBox_loc1")[0].value+">=-:-=>"+$("#transBox_loc2")[0].value;
        document.getElementById("hiddenForm").submit();
        document.getElementById("transBox_loc1").value = "";
        document.getElementById("transBox_loc2").value = "";
        document.getElementById("curtian").style.display = "none";
        document.getElementById("toolControlPanel").style.display = "none";
        document.getElementById("isToolActive_meta").setAttribute('content', 'no');
        $("#CB_text")[0].innerHTML = "Location Transfered";
        setTimeout(()=>{
            confirmationAnimation();
        }, 10);
    });

    if(device == "webpage"){
        document.getElementById("partView_location").onmouseenter =  function(){
            pullUpLocAni();
        };
        document.getElementById("partView_location").onmouseleave =  function(){
            closeLocAni();
        };
    }else{
        document.getElementById("partView_location").onclick =  function(){
            setTimeout(()=>{
                setTimeout(()=>{
                    pullUpLocAni();
                }, 60);
                $("#locationAniCurtain")[0].style="display: block;";
            }, 10);
        };
        document.getElementById("locationAniCurtain").onclick =  function(){
            closeLocAni();
            $("#locationAniCurtain")[0].style="display: none;";
        };
        document.getElementById("locationAnimationWrap").onclick =  function(){
            closeLocAni();
            $("#locationAniCurtain")[0].style="display: none;";
        };
    }
}

window.addEventListener('resize',()=> {
    console.log("window resized...");
    setTimeout(()=>{
        optimizeForDevice();
    },10);
    $("#noResultsBanner")[0].style.fontSize = document.body.clientWidth/20;
});

function resizeZoomImg(){
    if(device == "webpage"){
        document.getElementById("zoomImg").style.marginLeft = (document.body.clientWidth-document.getElementById("zoomImg").clientWidth)/2-6;
        document.getElementById("zoomImg").style.top = (document.body.clientHeight-document.getElementById("zoomImg").clientHeight)/2-6;
    }else{
        document.getElementById("zoomImg").style.marginLeft = 0;
    }
}

function loadAndTileifyFrag(n, storeInStr){
    document.getElementById("invisableSpacer").style.height = document.getElementById("loadPartsButton").clientHeight+2+"px";
    document.getElementById("loadPartsButton").style.display = "none";
    var INVENTORY_script = document.createElement('script'); 
    INVENTORY_script.onload = function(){   //do stuff with the script 
        var newInventoryFrag = eval(document.querySelector("meta[name=InventoryDATA]").getAttribute("content"));
        newInventoryFrag.forEach(element => {
            eval(storeInStr).push([[element], "INVENTORY"+n]);
        });
        console.log("INVENTORY"+n+" done loading into "+storeInStr);
        INVENTORYFiles_CyclesRun++;
        for(tilesLoaded; tilesLoaded < Inventory.length; tilesLoaded++){    //This for loop creates an HTML scale for every index of Inventory[]
            createTile(tilesLoaded, document.getElementById("tilesHolder"));
        }
        fetchQueuedImages();
        $("#loadingInventoryFileMessage")[0].style.display = "none";
        console.log("\'tilesLoaded\' holds: "+tilesLoaded); 
        document.getElementById("invisableSpacer").style.height = "0px";
        if(INVENTORYFiles_Count <= INVENTORYFiles_CyclesRun){
            document.getElementById("allInventoryLoadedMessage").style.display = "block";
        }else{
            document.getElementById("loadPartsButton").style.display = "block";
        }
    };
    INVENTORY_script.src = "Inventory_Files/INVENTORY"+n+".js"; 
    document.head.appendChild(INVENTORY_script);
}

function createAndShuffle_CycleOrder(){     //This function creates the "INVENTORYFiles_CycleOrder" array and puts the numbers in a random order
    INVENTORYFiles_CycleOrder = Array.from(Array(INVENTORYFiles_Count), (_, i) => i + 1);   //Create an array with numbers from 1 to "INVENTORYFiles_Count"

    for(let i = INVENTORYFiles_CycleOrder.length - 1; i > 0; i--){  //Shuffle "INVENTORYFiles_CycleOrder" array (using the Fisher-Yates algorithm)
        const j = Math.round(Math.random() * i);
        const temp = INVENTORYFiles_CycleOrder[i];
        INVENTORYFiles_CycleOrder[i] = INVENTORYFiles_CycleOrder[j];
        INVENTORYFiles_CycleOrder[j] = temp;
    }
}
function createTile(index, appendTo){ //This function creates a tile for the Inventory entry "index"
    var para = document.createElement("p");
    var locInfo = document.createElement("div");
    locInfo.id = "locationLine";
    var indexLocation = document.createElement("meta");
    indexLocation.id = "meta_indexLocation";
    indexLocation.name = "Index_Location";
    indexLocation.content = index;

    var nameLengthCutoff = 30;
    var node = document.createTextNode(Inventory[index][0][0][0]);
    if(Inventory[index][0][0][0] == ""){
        node = document.createTextNode("{No Name}");
        para.style.color = "#AEAEAE";
    }else if(Inventory[index][0][0][0].length > nameLengthCutoff && !(Inventory[index][0][0][0].length < nameLengthCutoff+3)){
        node = document.createTextNode(Inventory[index][0][0][0].substring(0,nameLengthCutoff)+"...");
    }

    var locationLengthCutoff = 20;
    var locationText = Inventory[index][0][0][1];
    if(Inventory[index][0][0][1].length > locationLengthCutoff && !(Inventory[index][0][0][1].length < locationLengthCutoff+3)){
        locationText = Inventory[index][0][0][1].substring(0,locationLengthCutoff)+"...";
    }
    var secondNode = document.createTextNode(locationText);
    var DOM_img = document.createElement("img");
    DOM_img.id = "ti_"+index;
    if(Inventory[index][0][0][5] != ""){
        DOM_img.src = "Images/subtleLoading.gif";   //"Inventory_Images/"+Inventory[index][0][0][5];
        img_fetchQueue.push([Inventory[index][0][0][5],Inventory[index][1].substring(9),"#"+DOM_img.id]);
        DOM_img.style = "width: 96px; ; display: block; margin-left: auto; margin-right: auto; margin: 1px; border: black 1px solid; border-radius: 2px;";
    }else{      //If there's no image included for this part, us the "noImg" image
        DOM_img.src = "Images/noImg.png";
        DOM_img.style = "width: 80px; display: block; margin-left: auto; margin-right: auto; padding: 1px";
    }
    if(Inventory[index][0][0][1].length < 10){//Adjusts the font-size of the location line based on it's length 
        locInfo.style="font-size: 14px";
    }else if(Inventory[index][0][0][1].length>=10 && Inventory[index][0][0][1].length<=14){
        if(device == "webpage"){
            locInfo.style="font-size: 12px";
        }else{
            locInfo.style="font-size: 11px";
        }
    }else if(Inventory[index][0][0][1].length>=15 && Inventory[index][0][0][1].length<=19){
        locInfo.style="font-size: 9px";
    }else if(Inventory[index][0][0][1].length>=20){
        locInfo.style="font-size: 7px";
    }

    if(Inventory[index][0][0][0].length<18){//Adjusts the font-size of the partName based on it's length 
        para.style.fontSize = "14px";
    }else if(Inventory[index][0][0][0].length>=18 && Inventory[index][0][0][0].length<26){
        para.style.fontSize ="12px";
    }else if(Inventory[index][0][0][0].length>=26){
        para.style.fontSize ="10px";
    }

    if(Inventory[index][0][0][4] == "0"){
        DOM_img.style.borderColor = "red";
    }

    locInfo.appendChild(secondNode);

    if(Inventory[index][0][0][6]){
        var blueBorder = document.createElement("div");
        blueBorder.id = "blueBorder";
        para.appendChild(blueBorder);
        blueBorder.appendChild(node);
        blueBorder.appendChild(DOM_img);
        blueBorder.appendChild(locInfo);
        blueBorder.appendChild(indexLocation);
        DOM_img.style.width = "94px";
        para.onmousedown = function(){ //This handles what happens when you press a tile 
            inventoryLoc = this.children[0].children[2].getAttribute('content');
            redundantTilePressStuff();
        }
    }else{
        para.appendChild(node);
        para.appendChild(DOM_img);
        para.appendChild(locInfo);
        para.appendChild(indexLocation);
        para.onmousedown = function(){ //This handles what happens when you press a tile 
            inventoryLoc = this.children[2].getAttribute('content');
            redundantTilePressStuff();
        }
    }
    if(appendTo != null){
        appendTo.appendChild(para);
    }else{
        return para;
    }   
    console.log("Tile Added");
}
var img_fetchQueue = [];
function fetchQueuedImages(){
    if($("#loadingImg")[0].complete && $("#loadingImg")[0].naturalHeight !== 0){        //If the loading dot dot dot img is rendered
        for(var i = 0; i < img_fetchQueue.length; i++){
            fetchImg(img_fetchQueue[i][0],img_fetchQueue[i][1],img_fetchQueue[i][2]);
        }
        img_fetchQueue = [];
    }else{
        setTimeout(()=>{
            fetchQueuedImages();
        },100);
    }
}
function redundantTilePressStuff(){
    document.getElementById("isActive_meta").setAttribute('content', 'yes');
    document.getElementById("viewPart").style.display = "block";
    document.getElementById("curtian").style.display = "block";
    document.getElementById("partView_SUPERWRAP").style.display = "block";
    build_partView(inventoryLoc); //builds partView, with location stored in the para's meta child (2)
    if(showingSearchResults){
        determineCarousel();
        if(eval(partCarousel).indexOf(eval(inventoryLoc)) != 0){
            document.getElementById("leftPointer").style.display = "block";
        }
        if(eval(partCarousel).indexOf(eval(inventoryLoc)) != eval(partCarousel).length-1){
            document.getElementById("rightPointer").style.display = "block";
        }
    }else{
        if(inventoryLoc != 0){
            document.getElementById("leftPointer").style.display = "block";
        }
        if(inventoryLoc != Inventory.length-1){
            document.getElementById("rightPointer").style.display = "block";
        }
    }
}
//match_Indexes  hit_Indexes  related_Indexes  partCarouselPosition  partCarousel
function determineCarousel(){
    //Determine which kind of result was selected by checking in which array the inventoryLoc value stored in the <p> exists
    console.log("Attempting to determine carousel");
    if(match_Indexes.indexOf(eval(inventoryLoc)) != -1){
        partCarousel = "match_Indexes";
        partCarouselPosition = match_Indexes.indexOf(eval(inventoryLoc));
    }else if(hit_Indexes.indexOf(eval(inventoryLoc)) != -1){
        partCarousel = "hit_Indexes";
        partCarouselPosition = hit_Indexes.indexOf(eval(inventoryLoc));
    }else if(related_Indexes.indexOf(eval(inventoryLoc)) != -1){
        partCarousel = "related_Indexes";
        partCarouselPosition = related_Indexes.indexOf(eval(inventoryLoc));
    }else if(cat_Indexes.indexOf(eval(inventoryLoc)) != -1){
        partCarousel = "cat_Indexes";
        partCarouselPosition = cat_Indexes.indexOf(eval(inventoryLoc));
    }else if(catLeaf_Indexes.indexOf(eval(inventoryLoc)) != -1){
        partCarousel = "catLeaf_Indexes";
        partCarouselPosition = catLeaf_Indexes.indexOf(eval(inventoryLoc));
    }else{
        console.log("Uh-oh, couldn't determine which result array to assign the carousel");
    }
    console.log("Carousel assigned to: "+partCarousel);
}

function build_partView(partIndex){
    document.getElementById("retrievedImg").src = "Images/subtleLoading.gif";
    console.log(partIndex);
    showingResultIndex = partIndex;
    /*#Col1*/
    document.getElementById("fooTile").appendChild(createTile(partIndex, null)); 
    var fooTileHeight = document.getElementById("fooTile").children[0].clientHeight;
    document.getElementById("fooTile_overlay").style = "height: "+(fooTileHeight+15)+"; margin-top: -"+(fooTileHeight+25);
    try{
        inventoryLoc = document.getElementById("fooTile").children[0].children[2].getAttribute("content");
    }catch{}
    try{
        inventoryLoc = document.getElementById("fooTile").children[0].children[0].children[2].getAttribute("content");
    }catch{}
    if(fooTileHeight > 160 && Inventory[partIndex][0][0][4] != ""){
        $("#PV_tileWrap")[0].style = "transform: scale(0.8); margin-top: -22px; margin-bottom: -24px; margin-left: -19px";
    }else if(fooTileHeight > 140 && fooTileHeight < 160 && Inventory[partIndex][0][0][4] != ""){
        $("#PV_tileWrap")[0].style = "transform: scale(0.85); margin-top: -16px; margin-bottom: -18px; margin-left: -15px;";
    }else if(fooTileHeight > 125 && fooTileHeight < 140 && Inventory[partIndex][0][0][4] != ""){
        $("#PV_tileWrap")[0].style = "transform: scale(0.9); margin-top: -7px; margin-bottom: -8px; margin-left: -8px;";
    }else{
        $("#PV_tileWrap")[0].style = "";
    }
    //setTimeout(()=>{
        $("#fooTile")[0].children[0].children[0].src = $("#ti_"+partIndex)[0].src;
    //},0);

    /*#Col2*/
    if(Inventory[partIndex][0][0][5] != ""){
        //setTimeout(()=>{
            document.getElementById("retrievedImg").src = $("#ti_"+partIndex)[0].src;
            document.getElementById("zoomImg").src = $("#ti_"+partIndex)[0].src;
        //},0);
        $("#blockZoomOverlay")[0].style.display = "none";
    }else{
        document.getElementById("retrievedImg").src = "Images/DropImageHere.png";
        $("#blockZoomOverlay")[0].style.width = $("#retrievedImg")[0].clientWidth+10;
        $("#blockZoomOverlay")[0].style.height = $("#retrievedImg")[0].clientHeight+8;
        $("#blockZoomOverlay")[0].style.marginTop = -($("#retrievedImg")[0].clientHeight+18);
        $("#blockZoomOverlay")[0].style.display = "block";
    }
    if(Inventory[partIndex][0][0][4] == "0"){
        if(device == "webpage"){
            $("#outofstockOverlayImg")[0].style.display = "block";
            $("#outofstockOverlayImg")[0].style.width = "93%";
            $("#outofstockOverlayImg")[0].style.height = $("#retrievedImg")[0].clientHeight+8;
            if(device == "webpage"){
                $("#outofstockOverlayImg")[0].style.marginTop = -($("#retrievedImg")[0].clientHeight+18);
            }else if(device == "mobileHorizontial"){
                $("#outofstockOverlayImg")[0].style.marginTop = "10px";
            }
        }else{
            $("#outofstockOverlayImg")[0].style.display = "block";
            $("#outofstockOverlayImg")[0].style.width = $("#retrievedImg")[0].clientWidth+8;
            $("#outofstockOverlayImg")[0].style.height = $("#retrievedImg")[0].clientHeight+8;
            $("#outofstockOverlayImg")[0].style.marginTop = -($("#retrievedImg")[0].clientHeight+18);
        }
        style="display: block;width: 267px;height: 202px;border-radius: 32px;margin-left: 10px;margin-top: -211px;z-index: 2147483647;opacity: 0.3;"

        $("#retrievedImg")[0].style.borderColor = "red";
        $("#zoomImg")[0].style.borderColor = "red";
        $("#hiddenMinusBlocker")[0].style.display = "block";
    }else{
        $("#outofstockOverlayImg")[0].style.display = "none";
        $("#retrievedImg")[0].style.borderColor = "white";
        $("#zoomImg")[0].style.borderColor = "white";
        $("#hiddenMinusBlocker")[0].style.display = "none";
    }
    if(Inventory[partIndex][0][0][0] == ""){   
        document.getElementById("partView_partName").innerHTML = "{No Name}";
    }else{
        document.getElementById("partView_partName").innerHTML = Inventory[partIndex][0][0][0];
    }
    if(Inventory[partIndex][0][0][0].length >= 26){     //Adjusts the font-size of the partName if it's super long 
        document.getElementById("partView_partName").style="font-size: 15px; margin: 3px";
    }else{
        document.getElementById("partView_partName").style="font-size: 20px; margin: 0px";
    }
    document.getElementById("partView_location").innerHTML = Inventory[partIndex][0][0][1];

    if(device == "webpage"){

    }else if(device == "mobileVertical"){
        $("#partView_location")[0].style.padding = "0px 22px 0px 22px";
        $("#partView_location")[0].style.fontSize = "21px";
        if($("#partView_location")[0].clientWidth > 245){
            $("#partView_location")[0].style.padding = "2px 6px 2px 6px"
        }
        var origFontSize = 21;
        while($("#partView_location")[0].clientWidth > 245){
            origFontSize--;
            $("#partView_location")[0].style.fontSize = origFontSize+"px";
        }
    }else if(device == "mobileHorizontial"){

    }


    if(Inventory[partIndex][0][0][3].length != 0){
        var tags = "";
        for(var i = 0; i<Inventory[partIndex][0][0][3].length-1; i++){
            tags += "#"+Inventory[partIndex][0][0][3][i]+"  -  ";
        }
        tags += "#"+Inventory[partIndex][0][0][3][i];
        document.getElementById("partView_tags").innerHTML = tags;
    }else{
        document.getElementById("partView_tags").innerHTML = "{no tags}";
    }
    var displacementLeft = ((document.getElementById("retrievedImg").width/1.4)+122)+"px";
    if(Inventory[partIndex][0][0][4] != ""){
        document.getElementById("partView_quantity").style.display = "block";
        document.getElementById("partView_quantity").innerHTML = Inventory[partIndex][0][0][4];
        if(device == "webpage"){
            document.getElementById("editPartDataButton").style.transform = "translate(0px, 0px)";
            document.getElementById("partView_quantity").style = "font-size: 20px";
            document.getElementById("partView_quantity").style.margin = "-40px 0 15px "+displacementLeft;
            document.getElementById("controlWrap").style.display = "block";
        }else{
            document.getElementById("editPartDataButton").style.transform = "translate(0px, -100px)";
            document.getElementById("partView_quantity").style = "";
        }
    }else{
        if(device == "webpage"){
            document.getElementById("partView_quantity").innerHTML = "|";
            document.getElementById("partView_quantity").style = "font-size: 10px; color: white";
            document.getElementById("partView_quantity").style.margin = "-40px 0 26px "+displacementLeft;
            document.getElementById("controlWrap").style.display = "none";
            document.getElementById("partView_quantity").style.display = "none";
        }else{

        }
    }
    document.getElementById("partView_catagoy").innerHTML = Inventory[partIndex][0][0][2];

    if(Inventory[partIndex][0][0].length == 8){
        if(device == "webpage"){
            document.getElementById("col2").style = "margin-left: -180px";
        }
        document.getElementById("description_text").innerHTML = Inventory[partIndex][0][0][7];
        if(device == "webpage"){
            document.getElementById("col3").style = "display: block; width: "+(430-document.getElementById("retrievedImg").clientWidth*0.7)+"; margin-left: "+(((document.getElementById("retrievedImg").clientWidth*0.6)+420))+"px";
        }else{
            document.getElementById("col3").style = "display: block";
        }
    }else{
        document.getElementById("col2").style = "margin-left: 0px";
        document.getElementById("col3").style.display = "none";
    }
    setTimeout(()=>{
        document.getElementById("hiddenBtn").focus();
    },10);
    if(Inventory[partIndex][0][0][4] == "0"){

    }
}

function scrollLeft_superFunc(){
    document.getElementById("leftPointer").src = "Images/leftPointer_active.png";
    scroll_partView_left();
    resizeZoomImg();
}
function scrollRight_superFunc(){
    document.getElementById("rightPointer").src = "Images/rightPointer_active.png";
    scroll_partView_right();
    resizeZoomImg();
}

var partCarouselPosition = 0;   //stores the current index location of the partCarousel[] array
var partCarousel = null;        //stores the result array to be scrolled through as a string
function scrollCore(changeVal){
    partCarouselPosition += changeVal;
    var fooTile = document.getElementById("fooTile");
    fooTile.removeChild(fooTile.childNodes[0]);
    build_partView(eval(partCarousel+"["+partCarouselPosition+"]"));
}
function scroll_partView_left(){
    document.getElementById("locationAnimationWrap").style.display = "none";
    document.getElementById("canvasBackground").src = "Images/LocationAniLoadingGIF.gif";
    document.getElementById("animationCanvas").getContext("2d").clearRect(0,0, 300, 200);
    if(showingSearchResults){
        if(partCarouselPosition > 0){   //if not showing the first inventoryLoc value at the beginning of the results array
            scrollCore(-1);
            document.removeEventListener('keyup',byeRP);
            document.getElementById("rightPointer").style.display="block";
        }
        if(eval(partCarousel).indexOf(eval(inventoryLoc)) == 0){
            document.addEventListener('keyup',byeLP);
        }
    }else{
        if(inventoryLoc > 0){
            inventoryLoc--;
            var fooTile = document.getElementById("fooTile");
            fooTile.removeChild(fooTile.childNodes[0]);
            build_partView(inventoryLoc);
            document.removeEventListener('keyup',byeRP);
            document.getElementById("rightPointer").style.display="block";
        }
        if(inventoryLoc == 0){
            document.addEventListener('keyup',byeLP);
        }
    }
}
function byeLP(){document.getElementById("leftPointer").style.display="none"}
function scroll_partView_right(){
    document.getElementById("locationAnimationWrap").style.display = "none";
    document.getElementById("canvasBackground").src = "Images/LocationAniLoadingGIF.gif";
    document.getElementById("animationCanvas").getContext("2d").clearRect(0,0, 300, 200);
    if(showingSearchResults){
        if(eval(partCarousel).indexOf(eval(inventoryLoc)) < eval(partCarousel).length-1){
            scrollCore(1);
            document.removeEventListener('keyup',byeLP);
            document.getElementById("leftPointer").style.display="block";
        }
        if(eval(partCarousel).indexOf(eval(inventoryLoc)) == eval(partCarousel).length-1){
            document.addEventListener('keyup',byeRP);
        }
    }else{
        if(inventoryLoc < Inventory.length-1){
            inventoryLoc++;
            var fooTile = document.getElementById("fooTile");
            fooTile.removeChild(fooTile.childNodes[0]);
            build_partView(inventoryLoc);
            document.removeEventListener('keyup',byeLP);
            document.getElementById("leftPointer").style.display="block";
        }
        if(inventoryLoc == Inventory.length-1){
            document.addEventListener('keyup',byeRP);
        }
    }
} 
function byeRP(){document.getElementById("rightPointer").style.display="none"}

document.addEventListener('keyup', event => {
    if(event.which == '37' && document.getElementById("isActive_meta").getAttribute('content') == 'yes'){ //Arrowkey functionality when in partView
        document.getElementById("leftPointer").src = "Images/leftPointer.png";
        document.getElementById("leftPointer").style.opacity = "0.3";
        document.getElementById("leftPointer").addEventListener("mouseover", ()=>{
            document.getElementById("leftPointer").style.opacity = "1";
        });
        document.getElementById("leftPointer").addEventListener("mouseleave", ()=>{
            document.getElementById("leftPointer").style.opacity = "0.3";
        });
    }
    if(event.which == '39' && document.getElementById("isActive_meta").getAttribute('content') == 'yes'){//Arrowkey functionality when in partView
        document.getElementById("rightPointer").src = "Images/rightPointer.png";
        document.getElementById("rightPointer").style.opacity = "0.3";
        document.getElementById("rightPointer").addEventListener("mouseover", ()=>{
            document.getElementById("rightPointer").style.opacity = "1";
        });
        document.getElementById("rightPointer").addEventListener("mouseleave", ()=>{
            document.getElementById("rightPointer").style.opacity = "0.3";
        });
    }
});

/*The following functions handle manipulating part data from partView */
function minus1(){
    $("#partView_quantity")[0].style.animation = "redFadeOut 3s";
    var modMessage = Inventory[showingResultIndex][1]+":";
    var i = 0;
    modMessage += "[";
    while(i<Inventory[showingResultIndex][0][0].length-1){
        modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i])+", ";
        i++;
    }
    modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i]);
    modMessage += "]";

    modMessage += ">=-:-=>";
    modMessage += "[";
    Inventory[showingResultIndex][0][0][4] = eval(Inventory[showingResultIndex][0][0][4])-1;

    var j = 0;
    while(j<Inventory[showingResultIndex][0][0].length-1){
        modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][j])+", ";
        j++;
    }
    modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][j]);
    modMessage += "]";

    console.log("modMessage: "+modMessage);

    document.getElementById("command_hiddenInput").value = "modData";
    document.getElementById("data_hiddenInput").value = modMessage;
    document.getElementById("hiddenForm").submit();

    document.getElementById("partView_quantity").innerHTML = document.getElementById("partView_quantity").innerHTML-1;
}
function add1(){
    var modMessage = Inventory[showingResultIndex][1]+":";
    var i = 0;
    modMessage += "[";
    while(i<Inventory[showingResultIndex][0][0].length-1){
        modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i])+", ";
        i++;
    }
    modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i]);
    modMessage += "]";

    modMessage += ">=-:-=>";
    modMessage += "[";
    Inventory[showingResultIndex][0][0][4] = eval(Inventory[showingResultIndex][0][0][4])+1;

    var j = 0;
    while(j<Inventory[showingResultIndex][0][0].length-1){
        modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][j])+", ";
        j++;
    }
    modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][j]);
    modMessage += "]";

    console.log("modMessage: "+modMessage);

    document.getElementById("command_hiddenInput").value = "modData";
    document.getElementById("data_hiddenInput").value = modMessage;
    document.getElementById("hiddenForm").submit();

    document.getElementById("partView_quantity").innerHTML = eval(document.getElementById("partView_quantity").innerHTML)+1;
}
function deleteEntry(){
    alert("Confirm, do you really want to delete this part? (reload the page to escape deletion)");
    //alert("This won't work until file manipulation is figured out");
    var modMessage = Inventory[showingResultIndex][1]+":";
    var i = 0;
    modMessage += "[";
    while(i<Inventory[showingResultIndex][0][0].length-1){
        modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i])+", ";
        i++;
    }
    modMessage += JSON.stringify(Inventory[showingResultIndex][0][0][i]);
    modMessage += "]";

    modMessage += ">=-:-=>";
    modMessage += "[]";

    console.log("modMessage: "+modMessage);

    document.getElementById("command_hiddenInput").value = "modData";
    document.getElementById("data_hiddenInput").value = modMessage;
    document.getElementById("hiddenForm").submit();

    Inventory.splice(showingResultIndex, 1);
    //document.getElementById("tilesHolder").children[eval(showingResultIndex)+1].remove();

    /*for(var i = eval(showingResultIndex)+1; i < Inventory.length+1; i++){
        document.getElementById("tilesHolder").children[i].querySelector("#meta_indexLocation").setAttribute("content", (document.getElementById("tilesHolder").children[i].querySelector("#meta_indexLocation").getAttribute("content"))-1);
    }*/

    //exit_partView();
}
function initiate_partModSetUp(){
    document.getElementById("command_hiddenInput").value = "setUpMod";
    document.getElementById("data_hiddenInput").value = JSON.stringify(Inventory[showingResultIndex]).replace(/"/g, "\\\"");
    document.getElementById("fileN_hiddenInput").value = JSON.stringify(Inventory[showingResultIndex][1].substring(9));
    document.getElementById("hiddenForm").submit();
}
function zoomImg(){
    document.getElementById("hiddenBtn").focus();
    if(document.getElementById("zoomActive_meta").getAttribute('content')=="yes"){
        document.getElementById("zoomActive_meta").setAttribute('content',"no");
        document.getElementById("zoomImgCurtain").style.display = "none";
        document.getElementById("zoomImg").style.display = "none";
    }else if(document.getElementById("zoomActive_meta").getAttribute('content')=="no"){
        document.getElementById("zoomActive_meta").setAttribute('content',"yes");
        document.getElementById("zoomImgCurtain").style.display = "block";
        document.getElementById("zoomImg").style.display = "inline-block";
        if(device == "webpage"){
            document.getElementById("zoomImg").style.marginLeft = (document.body.clientWidth-document.getElementById("zoomImg").clientWidth)/2-6;
            document.getElementById("zoomImg").style.top = (document.body.clientHeight-document.getElementById("zoomImg").clientHeight)/2-6;
        }else{
            document.getElementById("zoomImg").style.marginLeft = 0;
        }
    }
}

function loadUpLastInventoryFile(){
    [...document.getElementById("tilesHolder").children].forEach((el)=>{
        el.remove();
    });
    INVENTORYFiles_CyclesRun = 0;
    loadAndTileifyFrag(INVENTORYFiles_Count, "Inventory");
    //Set cycle count to 1 and reshuffle
    createAndShuffle_CycleOrder();
    //Take last inventory file# out of cycle array
    INVENTORYFiles_CycleOrder.splice(INVENTORYFiles_CycleOrder.indexOf(INVENTORYFiles_Count),1);
    //add it back to the beginning of the array
    INVENTORYFiles_CycleOrder.splice(0,0,INVENTORYFiles_Count);
}
function confirmationAnimation(){
    var elem = document.getElementById("confirmationBlock");
    elem.classList.remove("CB_RunAnimation");
    void elem.offsetWidth;
    elem.classList.add("CB_RunAnimation");
}

/* ------------------------------------- v Searching Functionality v ------------------------------------- */
var prompt = "";
var searchTerm = "";
var result_fragIndexes = [];  //Stores the indexes in the fragInventory array where there was a hit, is refreshed everytime a new fragment is loaded up
var matchArray = [];
var hitArray = [];
var relatedArray = [];

var match_Indexes = [];
var hit_Indexes = [];
var related_Indexes = [];
var cat_Indexes = [];
var catLeaf_Indexes = [];

var inventoryFragment = [];
var totalMatches = 0;
var totalHits = 0;
var totalRelated = 0;

function prepareScreenForResults(level){
    var resultWrap = document.createElement("div");
    resultWrap.id = "resultWrap"+level;
    document.body.insertBefore(resultWrap, document.getElementById("marker"));

    var sideBar = document.createElement("div");
    sideBar.id = "search_sideBar";
    if(level == "lookNext"){
        sideBar.id = "search_sideBar_lookNext";
    }
    resultWrap.appendChild(sideBar);

    var sideBarInfoIcon = document.createElement("img");
    sideBarInfoIcon.id = "search_sideBar_infoIcon"+level;
    sideBar.appendChild(sideBarInfoIcon);
    sideBarInfoIcon.src = "Images/infoIcon2.png";
    var sideBarInfoText = document.createElement("div");
    sideBarInfoText.id = "search_sideBar_infoText"+level;
    sideBarInfoText.className = "search_sideBar_infoText";
    if(level == 1){
        sideBarInfoText.innerHTML = "A Match is where the Search Term and part name are identical";
    }else if(level == 2){
        sideBarInfoText.innerHTML = "Hits are where a fragment string of the Search Term exist within the part name or tags";
    }else if(level == 3){
        sideBarInfoText.innerHTML = "Parts are related to the Search Term when one of its fragment strings exists in the description";
    }else if(level == "Catagory"){
        sideBarInfoText.innerHTML = "These are parts that have been assigned to the Selected Catagory";
    }else if(level == "lookNext"){
        sideBarInfoText.innerHTML = "Within the search results, these are the most common catagory assignments. May be good places to continue your search";
    }else if(level == "CatagoryLeaves"){
        sideBarInfoText.innerHTML = "These are parts that have been assigned to a leaf catagory of the selected catagory branch";
    }

    var sideBarText = document.createElement("div");
    sideBarText.id = "search_sideBar_Text";
    sideBar.appendChild(sideBarText);
    if(level == 1){
        sideBarText.innerHTML += "Match(es)...";
    }else if(level == 2){
        sideBarText.innerHTML += "Hit(s)...";
    }else if(level == 3){
        sideBarText.innerHTML += "Related(s)...";
    }else if(level == "Catagory"){
        sideBarText.innerHTML += "Included in Catagory..."
    }else if(level == "lookNext"){
        sideBarText.innerHTML += "Where to look next..."
    }else if(level == "CatagoryLeaves"){
        sideBarText.innerHTML += "Included in Catagory Leaf..."
    }

    var new_tilesHolder_GridWrap = document.createElement("div");
    new_tilesHolder_GridWrap.id = "search_tilesHolder"+level+"_GridWrap";
    resultWrap.appendChild(new_tilesHolder_GridWrap);
    var new_tilesHolder = document.createElement("div");
    new_tilesHolder.id = "search_tilesHolder"+level;
    new_tilesHolder_GridWrap.appendChild(new_tilesHolder);
    resultWrap.appendChild(sideBarInfoText);
    document.getElementById("search_sideBar_infoIcon"+level).addEventListener("mouseover", (event)=>{
        document.getElementById("search_sideBar_infoText"+level).style.display = "block";
        document.getElementById("search_sideBar_infoText"+level).style.top = event.clientY+5;
    }, false);
    document.getElementById("search_sideBar_infoIcon"+level).addEventListener("mouseleave", ()=>{
        document.getElementById("search_sideBar_infoText"+level).style.display = "none"
    }, false);
    if(device != "webpage"){
        document.onscroll = ()=>{
            [...$(".search_sideBar_infoText")].forEach((e)=>{
                e.style.visability = "hidden";
            });
        }
        document.onmousedown = ()=>{
            [...$(".search_sideBar_infoText")].forEach((e)=>{
                e.style.visability = "visable";
            });
        }
        $("#spaceToGoHomeMessage")[0].onclick = ()=>{
            $("#spaceToGoHomeMessage")[0].style = "color: black;background-color: yellow;border: 2px black solid; display: block; opacity: 1";
            setTimeout(()=>{
                $("#spaceToGoHomeMessage")[0].style = "display:none";
            },100);
            window.location.href = "Astradux.html";
        }
        $("#spaceToGoHomeMessage")[0].innerHTML="Click to go Home";
    }
}
function createSearchingTile(appendTo,level){   //Create the searching placeholder tile
    var seaching_StyleTile_wrap = document.createElement("div");
    seaching_StyleTile_wrap.id = "seaching_StyleTile_wrap"+level;
    appendTo.appendChild(seaching_StyleTile_wrap);
    var seaching_StyleTile_overlay = document.createElement("div");
    seaching_StyleTile_overlay.id = "seaching_StyleTile_overlay";
    seaching_StyleTile_wrap.appendChild(seaching_StyleTile_overlay);
    var seaching_StyleTile = document.createElement("p");
    seaching_StyleTile.className = "seaching_StyleTile";
    document.getElementById(("seaching_StyleTile_wrap"+level)).appendChild(seaching_StyleTile);
    var titleContainer = document.createElement("div");
    titleContainer.innerHTML = "Searching...";
    titleContainer.style = "margin-top:4px";
    seaching_StyleTile.appendChild(titleContainer);
    var searchingImage = document.createElement("img");
    searchingImage.src = "Images/searching2.gif";
    searchingImage.style = "width: 96px; ; display: block; margin-left: auto; margin-right: auto; margin: 1px; border: transparent 1px solid; border-radius: 2px;";
    seaching_StyleTile.appendChild(searchingImage);
    var countContainer = document.createElement("div");
    countContainer.innerHTML = "-/-";
    countContainer.style = "margin-bottom:10px";
    countContainer.id = "search_countContainer"+level;
    seaching_StyleTile.appendChild(countContainer);
    var fileCountContainer = document.createElement("div");
    fileCountContainer.innerHTML = "~/~";
    fileCountContainer.style = "margin-bottom:10px";
    fileCountContainer.id = "search_fileCountContainer"+level;
    fileCountContainer.className = "search_fileCountContainer";
    seaching_StyleTile.appendChild(fileCountContainer);
}
function isRepeat(indexNum){    //This function checks whether or not a certian index number is already in the results array
    overFunk: { 
        for(var i = 0; i < result_fragIndexes.length; i++){
            if(indexNum == result_fragIndexes[i]){
                return true;
                break overFunk;
            }
        }
        return false;
    }
}
function splitPrompt_intoFragments(prompt){
    fragments = [];
    modPrompt = prompt;  //remove any "(" ")" "[" "]" "|" from the search term and spilt up search term by characters: "-" " " "/" "\" "&" ","
    for(var i = 0; i < unwantedCharacters.length; i++){
        if(prompt.indexOf(unwantedCharacters[i]) != -1){
            modPrompt = modPrompt.replace(unwantedCharacters[i], "");
        }
    }
    console.log("Your prompt string has been modified to: " + modPrompt+ " and will now be split");
    for(var i = 0; i < splitCharacters.length; i++){
        modPrompt = modPrompt.split(splitCharacters[i]).toString();
    }
    fragments = modPrompt.split(",");
    for(var i = fragments.length-1; i >= 0; i--){
        if(fragments[i] == ""){     //delete any empty fragments from the fragments array
            fragments.splice(i);
            continue;
        }
        if(fragments[i].substring(fragments[i].length-2,fragments[i].length) == "es"){       //Get rid of any ending "s"s or "es"s from the end of fragments
            fragments[i] = fragments[i].substring(0,fragments[i].length-2);
        }else if(fragments[i].substring(fragments[i].length-1,fragments[i].length) == "s"){
            fragments[i] = fragments[i].substring(0,fragments[i].length-1);
        }
    }
    console.log("These are the fragments that have been processed out of your original prompt: "+fragments);
}

var seachTypeTitleHeight = 19;
function conduct_L1search(prompt){  //Search looking for full name match (case insensitive)
    var numFragMatches = 0;
    for(var i = 0; i<inventoryFragment.length; i++){ //Tests each element in inventoryFragment[] for a match with query 
        if(prompt == (inventoryFragment[i][0][0][0]).toLowerCase()){ //This is already good
            console.log("Match!");
            result_fragIndexes.push(i); //This array is used to prevent a match from also being a hit down the line 
            Inventory.push(inventoryFragment[i]);
            document.getElementById("search_tilesHolder1").insertBefore(createTile(Inventory.length-1, null), document.getElementById("seaching_StyleTile_wrap1"));
            match_Indexes.push(Inventory.length-1);
            numFragMatches++;
        }
        document.getElementById("search_countContainer1").innerHTML = (i+1)+"/"+inventoryFragment.length;
    }
    console.log(">>>>>Search L1 Complete, query had "+numFragMatches+" Matches (s) in frag<<<<<");
    totalMatches += numFragMatches;
}
var modPrompt = "";
var fragments = [];
var unwantedCharacters = ["<", ">", "[", "]", "{", "}", "|", "(", ")", "?", "!", ":", ";", "\"", "\'", ".", "~", "`", "@", "#", "$", "%", "^", "*"];
var splitCharacters = ["-", " ", "/", "\\", "&"];
function conduct_L2search(prompt){  //One of the individual words in the query matches one of the individual words in the part name or tags
    var numFragHits = 0;
    if(fragments.length > 1){    //This prevents an unnessary for loop from running if there aren't multiple fragments to run the search on
        for(var i = 0; i<inventoryFragment.length; i++){ //Tests each element in inventoryFragment[] for a hit with query 
            var name_and_tagCompilation = inventoryFragment[i][0][0][0].toLowerCase()+" "+inventoryFragment[i][0][0][3].toString().toLowerCase();
            //console.log("The inventoryFragment entry "+ i + "'s name and tags have been smushed into:"+name_and_tagCompilation);
            for(var j = 0; j < fragments.length; j++){  //for(each fragment){
                if(name_and_tagCompilation.indexOf(fragments[j]) != -1){   //use indexOf() to identify any matches
                    console.log("Hit!");
                    if(!isRepeat(i)){   //if part index is not already in the array{
                        result_fragIndexes.push(i);
                        Inventory.push(inventoryFragment[i]);
                        console.log("Hit ruled unique and was added to the Inventory array");
                        hit_Indexes.push(Inventory.length-1);
                        document.getElementById("search_tilesHolder2").insertBefore(createTile(Inventory.length-1, null), document.getElementById("seaching_StyleTile_wrap2"));
                        numFragHits++;
                    }
                }
                document.getElementById("search_countContainer2").innerHTML = (i+1)+"/"+inventoryFragment.length;
            }
        }
    }else{
        for(var i = 0; i<inventoryFragment.length; i++){ //Tests each element in inventoryFragment[] for a hit with query 
            var name_and_tagCompilation = inventoryFragment[i][0][0][0].toLowerCase()+" "+inventoryFragment[i][0][0][3].toString().toLowerCase();
            //console.log("The inventoryFragment entry "+ i + "'s name and tags have been smushed into:"+name_and_tagCompilation);
            if(name_and_tagCompilation.indexOf(fragments.toString()) != -1){   //use indexOf() to identify any matches
                console.log("Hit!");
                if(!isRepeat(i)){   //if( part index is not already in the array{
                    result_fragIndexes.push(i);
                    console.log("Hit ruled unique and was added to the Inventory array");
                    Inventory.push(inventoryFragment[i]);
                    hit_Indexes.push(Inventory.length-1);
                    document.getElementById("search_tilesHolder2").insertBefore(createTile(Inventory.length-1, null), document.getElementById("seaching_StyleTile_wrap2"));
                    numFragHits++;
                }
            }
            document.getElementById("search_countContainer2").innerHTML = (i+1)+"/"+inventoryFragment.length;
        }
    }
    console.log(">>>>>Search L2 Complete, query had "+numFragHits+" Hit(s) in frag<<<<<");
    totalHits += numFragHits;
}
function conduct_L3search(prompt){
    var numFragRelated = 0;
    for(var i = 0; i<inventoryFragment.length; i++){ //Tests each element in inventoryFragment[] for a match with query 
        if(inventoryFragment[i][0][0].length == 8){
            console.log("This inventory entry has a description! Checking for fragments in description");
            for(var j = 0; j < fragments.length; j++){  //for(each fragment){
                if(inventoryFragment[i][0][0][7].indexOf(fragments[j]) != -1){   //use indexOf() to identify any matches
                    console.log("Related!");
                    if(!isRepeat(i)){   //if part index is not already in the array{
                        result_fragIndexes.push(i);
                        console.log("Hit ruled unique and was added to the Inventory array");
                        Inventory.push(inventoryFragment[i]);
                        related_Indexes.push(Inventory.length-1);
                        document.getElementById("search_tilesHolder3").insertBefore(createTile(Inventory.length-1, null), document.getElementById("seaching_StyleTile_wrap3"));
                        numFragRelated++;
                    }
                }
            }
        }
        document.getElementById("search_countContainer3").innerHTML = (i+1)+"/"+inventoryFragment.length;
    }
    console.log(">>>>>Search L3 Complete, query had "+numFragRelated+" Related(s) in frag<<<<<");
    totalRelated += numFragRelated;
}

function doesCatExistincatCounts(catName){
    catCountLoop:{
        for(var i = 0; i<catCounts.length; i++){
            if(catName == catCounts[i][0]){
                catIndex_in_catCounts = i;
                return true;
                break catCountLoop;
            }
        }
        return false;
    }
}

var catIndex_in_catCounts = 0;
var catCounts = [];     //This array will track the occurances of each catagory in the form [[catName, #occurances], ...]
var sortedcatCounts = [];   //The catagories in catCounts will be sorted in order of occurance to this array
function show_WhereToLookNext(){
    catIndex_in_catCounts = 0;
    catCounts = [];
    sortedcatCounts = [];
    console.log("show_WhereToLookNext has started");
    prepareScreenForResults("lookNext");
    document.getElementById("search_tilesHolderlookNext").innerHTML = gearImageHTML;
    var crunchText = document.createElement("div");
    crunchText.id = "crunchText";
    crunchText.innerHTML = "Crunching Numbers";
    document.getElementById("search_tilesHolderlookNext").appendChild(crunchText);
    document.getElementById("search_tilesHolderlookNext_GridWrap").style = "width: 300px";
    Inventory.forEach((item, index) => {
        var partCatagory = item[0][0][2]; //Get the catagory of the item saved at this Inventory index
        if(doesCatExistincatCounts(partCatagory)){//if(that catName already exists in the catCounts array){
            catCounts[catIndex_in_catCounts][1]++;//iterate (that index)[1]
        }else{
            catCounts.push([]);//push a new array onto the catCounts array in the form [catName, 1]
            catCounts[catCounts.length-1].push([partCatagory],[1]);
        }
    });
    console.log("Here are all the catagories that occur in the search results: " + catCounts);
    //Reset width we set before (uncomment when you're ready to get rid of the crunching numebrs indicatior)
    var thresholdPercent = (10-(Math.sqrt(Inventory.length/100)))/100;   //This math determines whether or not a catagory is present enough in the results array to be significant
    console.log("ThesholdPercent: "+thresholdPercent*100+"%");
    catCounts.forEach((element, index) => {     //weed out all catagories from the array with less than __% occurance and the entpy catagory "" if it's there
        if(element[1]/Inventory.length < thresholdPercent || element[0] == ""){
            catCounts.splice(index, 1);
            console.log("A catagory in the catCounts array was ruled insignificant and was removed from the cat counts array");
        }
    });
    console.log("Ok, the catagories that occur a significant number of times and their # of occurances are: "+catCounts);
    var occuranceList = [];
    catCounts.forEach((element) => {        //Sort the catagories by # of occurances
        occuranceList.push(element[1]);
    });
    console.log("Unsorted Occurance List: "+occuranceList);
    occuranceList.sort();
    occuranceList.reverse();
    console.log("Sorted Occurance List: "+occuranceList);
    for(var i = 0; i<occuranceList.length; i++){    
        findOcc:{
            for(var j = 0; j<catCounts.length; j++){
                if(catCounts[j][1] == occuranceList[i]){
                    sortedcatCounts.push(catCounts[j]);
                    break findOcc;
                }
            }
        }
    }
    console.log("...and here are those catagories sorted by their # of occurances: "+sortedcatCounts);
    setTimeout(()=>{
        try{document.getElementById("gearImage").remove();  //Get rid of "crunching numbers" placeholder
            document.getElementById("crunchText").remove();}catch{}
        try{document.getElementById("search_tilesHolderlookNext_GridWrap").style.width = "";}catch{}
        for(var i = 0; i < sortedcatCounts.length; i++){    //diplay catagories on the screen
            if(sortedcatCounts[i][0][0] != ""){
                var catBox = document.createElement("div");
                catBox.id = "lookNextCatBlock";
                searchCatLayer("catagories", sortedcatCounts[i][0][0].toLowerCase());
                if(catagoryExists){
                    if(eval(catagoryIndexStr).length == 1){
                        catBox.id = "lookNextCatBlock_end";
                    }
                }else{
                    catBox.id = "lookNextCatBlock_rouge";
                }
                catBox.innerHTML = sortedcatCounts[i][0][0];
                catBox.onclick = function(){
                    document.getElementById("inquiry").value = this.innerHTML.replace(/&amp;/g, '&');   //(the replace() fixes and & that would be turned into &amp) 
                    setTimeout(catSearch(), 0);
                };
                document.getElementById("search_tilesHolderlookNext").appendChild(catBox);
            }
        }
    }, 50);
}

var catagoryExists = false;
var catagoryIndexStr = "";
function searchCatLayer(layer, target){
    catagoryExists = false;
    breakAllLoopLayers = false;
    catagoryIndex = "";
    Loop:{
        for(var i = 0; i < eval(layer).length; i++){
            if(breakAllLoopLayers){
                break Loop;
            }
            var layerObject = layer+"["+i+"]";
            console.log("LayerObject is: "+layer+"["+i+"]");
            console.log(eval(layerObject)[0]);
            if(eval(layerObject)[0].toLowerCase() == target){
                console.log("found the catagory!");
                catagoryExists = true;
                breakAllLoopLayers = true;
                catagoryIndexStr = layerObject;
                return true;
                break Loop;
            }
            if(eval(layerObject).length != 1){
                var newLayer = layerObject+"[1]";
                searchCatLayer(newLayer, target);
            }
        }
    }
}

var numberofCatagoryHits = 0;
var numberofCatagoryLeavesHits = 0;
function conduct_catagorySearch(catagory, type, currentCatIndexStr){   //type specifies whether the search applies to the branch catagory or one of its leaves
    for(var i = 0; i<inventoryFragment.length; i++){ //Tests each element in inventoryFragment[] for a match
        if(catagory.toLowerCase() == (inventoryFragment[i][0][0][2]).toLowerCase()){
            console.log("Match!");
            Inventory.push(inventoryFragment[i]);
            document.getElementById("search_tilesHolder"+type).insertBefore(createTile(Inventory.length-1, null), document.getElementById("seaching_StyleTile_wrap"+type));
            result_fragIndexes.push(i);
            if(type == "Catagory"){
                numberofCatagoryHits++;
                cat_Indexes.push(Inventory.length-1);
            }else if(type == "CatagoryLeaves"){
                numberofCatagoryLeavesHits++;
                catLeaf_Indexes.push(Inventory.length-1);
            }
        }
        document.getElementById("search_countContainer"+type).innerHTML = (i+1)+"/"+inventoryFragment.length;
    }
    if(type == "Catagory"){
        console.log(">>>>>Catagory Search Complete, query had "+numberofCatagoryHits+" Matches (s)<<<<<");
    }else if(type == "CatagoryLeaves"){
        console.log(">>>>>Catagory Leaf Search Complete, query had "+numberofCatagoryLeavesHits+" Matches (s)<<<<<");
    }
    if(eval(currentCatIndexStr).length == 2){   //Recursive Leaf Search
        for(var i = 0; i<eval(currentCatIndexStr)[1].length; i++){
            var curentLocObject = eval(currentCatIndexStr)[1][i];
            conduct_catagorySearch(eval(curentLocObject)[0], "CatagoryLeaves", curentLocObject);
        }
    }
}

function generalSearchProcedures(){
    document.getElementById("inquiry").blur();
    document.getElementById("spaceToGoHomeMessage").style.display = "none";
    if(showingSearchResults){
        try{document.getElementById("resultWrap1").remove();}catch{}    //If no search results were found these could already be gone!
        try{document.getElementById("resultWrap2").remove();}catch{}
        try{document.getElementById("resultWrap3").remove();}catch{}
        try{document.getElementById("resultWrapCatagory").remove();}catch{}
        try{document.getElementById("resultWraplookNext").remove();}catch{}
        $("#noResultsBanner")[0].style.display = "none";
    }else{
        document.getElementById("tilesHolder").remove();
        document.getElementById("partView_SUPERWRAP").style.display = "none";
        document.getElementById("curtian").style.display = "none";
        document.getElementById("loadPartsButton").style.display = "none";
        document.getElementById("allInventoryLoadedMessage").style.display = "none";
        document.getElementById("toolbox").remove();
        document.getElementById("toolControlPanel").remove();
    }
    Inventory = [];
    match_Indexes = [];
    hit_Indexes = [];
    related_Indexes = [];
    cat_Indexes = [];
    catLeaf_Indexes = [];
    INVENTORYFiles_CyclesRun = 0;
    createAndShuffle_CycleOrder();
    document.getElementById("homeBlocker_meta").setAttribute('content', 'off');
}
function fullSearch_cycle(ST){
    conduct_L1search(ST);
    conduct_L2search(ST);
    conduct_L3search(ST);
}

function fullSearch(){
    generalSearchProcedures();
    showingSearchResults = true;
    searchTerm = document.getElementById("inquiry").value.toLowerCase();
    console.log("Enter keypress was heard, running search...");
    console.log("Seach query recorded: " + searchTerm);
    searchTermTesting:{
        if(searchTerm == ""){
            console.log("Wait a minuite, that search term is invalid! Cannot execute search");
        }else{
            numberofCatagoryHits = 0;
            numberofCatagoryLeavesHits = 0;
            totalMatches = 0;
            totalHits = 0;
            totalRelated = 0;
            searchCatLayer("catagories", searchTerm);   //Check, "does this search term match any catagories in the catagory list?"
            if(catagoryExists){
                var runCatSearchInstead = confirm("The search term you entered matches the catagory: "+eval(catagoryIndexStr)[0]+", would you like to run a catagory search instead?");
                if(runCatSearchInstead){
                    catSearch();
                    break searchTermTesting;
                }
            }
            prepareScreenForResults(1); //Prepare Screen for Matches
            createSearchingTile(document.getElementById("search_tilesHolder1"), 1);
            prepareScreenForResults(2);     //Prepare Screen for Hits
            createSearchingTile(document.getElementById("search_tilesHolder2"), 2);
            prepareScreenForResults(3);  //Prepare Screen for Relateds
            createSearchingTile(document.getElementById("search_tilesHolder3"), 3);
            splitPrompt_intoFragments(searchTerm);
            // ---------------------------------------------------------------------------------------
            search_recursiveDriver("full");
            // ---------------------------------------------------------------------------------------

        }
    }
}
function catSearch(){
    console.log("Enter keypress was heard, regular search exchanged for a catagory search, or catBlock clicked; running search...");
    searchTerm = document.getElementById("inquiry").value.toLowerCase();
    console.log("Seach query recorded: " + searchTerm);
    searchCatLayer("catagories", searchTerm);
    if(!catagoryExists){
        alert("Whoops! It looks like that catagory doesn't esist in the catagories array!");
    }else{
        generalSearchProcedures();
        showingSearchResults = true;
        if(searchTerm == ""){
            console.log("Wait a minuite, that search term is invalid! Cannot execute search");
        }else{
            result_fragIndexes = [];
            prepareScreenForResults("Catagory"); //Prepare Screen for Matches
            createSearchingTile(document.getElementById("search_tilesHolder"+"Catagory"), "Catagory");
            if(eval(catagoryIndexStr).length == 2){
                console.log("The catagory the user searched for has leaves! Ajusting the DOM accordingly...");
                prepareScreenForResults("CatagoryLeaves");
                createSearchingTile(document.getElementById("search_tilesHolder"+"CatagoryLeaves"), "CatagoryLeaves");
            }
            numberofCatagoryHits = 0;
            numberofCatagoryLeavesHits = 0;
            // ---------------------------------------------------------------------------------------
            search_recursiveDriver("cat");
            // ---------------------------------------------------------------------------------------
        }
    }
}

var searchCycleInterum = 200;
function search_recursiveDriver(typeOfSearch){   //The recursive function that handles pulling data from the inventory files
    if(INVENTORYFiles_CyclesRun == INVENTORYFiles_Count){   //If all Inventory Files have been searched through
        console.log(">Total Search Results: "+Inventory.length);
        if(typeOfSearch == "full"){
            show_WhereToLookNext();
            if(catCounts.length == 0){
                try{document.getElementById("resultWraplookNext").remove();}catch{}
                console.log("There were no catagories that exceeded the threshold in lookNext, removing the lookNext resultsWrap");
            }
            document.getElementById("seaching_StyleTile_wrap1").remove();
            if(totalMatches == 0){
                document.getElementById("resultWrap1").remove();
            }
            document.getElementById("seaching_StyleTile_wrap2").remove();
            if(totalHits == 0){
                document.getElementById("resultWrap2").remove();
            }
            document.getElementById("seaching_StyleTile_wrap3").remove();
            if(totalRelated == 0){
                document.getElementById("resultWrap3").remove();
            }
        }else if(typeOfSearch == "cat"){
            document.getElementById("seaching_StyleTile_wrapCatagory").remove();
            try{document.getElementById("seaching_StyleTile_wrapCatagoryLeaves").remove();}catch{}
            if(numberofCatagoryHits == 0){
                console.log("There were no Catagory hits, removing the Catagory resultsWrap");
                document.getElementById("resultWrapCatagory").remove();
            }
            if(numberofCatagoryLeavesHits == 0){
                console.log("There were no CatagoryLeaves hits, removing the CatagoryLeaves resultsWrap");
                try{document.getElementById("resultWrapCatagoryLeaves").remove()}catch{};
            }
        }
        document.getElementById("spaceToGoHomeMessage").style.display = "block";
        document.getElementById("hiddenBtn").focus();
        if(Inventory.length == 0){
            $("#noResultsBanner")[0].style.display = "block";
            $("#noResultsBanner")[0].style.fontSize = document.body.clientWidth/20;
        }
        fetchQueuedImages();
    }else{
        var INVENTORY_script = document.createElement('script');
        INVENTORY_script.onload = function(){   //do stuff with the script after it's done putting data into the InventoryDATA meta
            var newInventoryFrag = eval(document.querySelector("meta[name=InventoryDATA]").getAttribute("content"));
            newInventoryFrag.forEach(element => {
                inventoryFragment.push([[element], "INVENTORY"+INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun]]);
            });
            document.querySelectorAll(".search_fileCountContainer").forEach((item)=>{
                item.innerHTML = INVENTORYFiles_CyclesRun+"/"+inventoryFiles_Count;
            });
            if(typeOfSearch == "full"){
                console.log("Running a full search on Inventory fragment from: INVENTORY"+INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun]+"...");
                fullSearch_cycle(searchTerm);
                setTimeout(()=>{
                    search_recursiveDriver("full");
                }, searchCycleInterum);
            }else if(typeOfSearch == "cat"){
                console.log("Running a catagory search on Inventory fragment from: INVENTORY"+INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun]+"...");
                conduct_catagorySearch(searchTerm, "Catagory", catagoryIndexStr);
                setTimeout(()=>{
                    search_recursiveDriver("cat");
                }, searchCycleInterum);
            }else{
                console.log("(!)The search_recursiveDriver() function was called but with an unknown search type parameter");
            }
            inventoryFragment = [];
            result_fragIndexes = [];
            console.log("Inventory fragment from: INVENTORY"+INVENTORYFiles_CycleOrder[INVENTORYFiles_CyclesRun]+" searched and inventoryFragment[] wiped");
            INVENTORYFiles_CyclesRun++;

        };
        INVENTORY_script.src = "Inventory_Files/INVENTORY"+INVENTORYFiles_CycleOrder[(INVENTORYFiles_CyclesRun)]+".js";
        document.head.appendChild(INVENTORY_script);
    }
}

document.addEventListener('keydown', (e)=> { //a to go to addAPart, arrow keys to scroll through parts
    if(e.which == '37' && document.getElementById("isActive_meta").getAttribute('content') == 'yes'){ //Arrowkey functionality when in partView
        scrollLeft_superFunc();
        document.getElementById("leftPointer").style.opacity = "1";
    }
    if(e.which == '39' && document.getElementById("isActive_meta").getAttribute('content') == 'yes'){//Arrowkey functionality when in partView
        scrollRight_superFunc();
        document.getElementById("rightPointer").style.opacity = "1";
    }else if(e.keyCode === 13 && document.activeElement.id == 'inquiry') {  //checks whether the pressed key is "Enter"
        if(device != "webpage"){
            unfillSearchbar();
        }
        fullSearch();
    }else if(showingSearchResults && event.code === 'Space' && document.activeElement.tagName != "INPUT" && document.getElementById("isActive_meta").getAttribute('content')=="no"){
        if(document.getElementById("homeBlocker_meta").getAttribute('content') == "off"){
            window.location = "Astradux.html";
        }/*else{
            document.getElementById("homeBlocker_meta").setAttribute('content', 'off');
        }*/
    }
});

var catagories = eval(document.querySelector("meta[name=CaragoryDATA]").getAttribute("content"));

var gearImageHTML  = "<!--CATION: Image not payed for, don't distribute-->\n<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"transform: scale(0.5)\" width=\"200px\" height=\"200px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" id=\"gearImage\" id=\"gearAnimation\"><g transform=\"translate(50 50)\"> <g transform=\"translate(-17 -17) scale(0.5)\"> <g transform=\"rotate(36.7814)\"><animateTransform attributeName=\"transform\" type=\"rotate\" values=\"0;45\" keyTimes=\"0;1\" dur=\"0.2s\" begin=\"0s\" repeatCount=\"indefinite\"></animateTransform><path d=\"M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268 L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23\" fill=\"#000000\"></path></g></g> <g transform=\"translate(0 22) scale(0.4)\"> <g transform=\"rotate(30.7186)\"><animateTransform attributeName=\"transform\" type=\"rotate\" values=\"45;0\" keyTimes=\"0;1\" dur=\"0.2s\" begin=\"-0.1s\" repeatCount=\"indefinite\"></animateTransform><path d=\"M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268 L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23\" fill=\"#6b6b6b\"></path></g></g> <g transform=\"translate(28 4) scale(0.3)\"> <g transform=\"rotate(14.2814)\"><animateTransform attributeName=\"transform\" type=\"rotate\" values=\"0;45\" keyTimes=\"0;1\" dur=\"0.2s\" begin=\"-0.1s\" repeatCount=\"indefinite\"></animateTransform><path d=\"M37.3496987939662 -7 L47.3496987939662 -7 L47.3496987939662 7 L37.3496987939662 7 A38 38 0 0 1 31.359972760794346 21.46047782418268 L31.359972760794346 21.46047782418268 L38.431040572659825 28.531545636048154 L28.531545636048154 38.431040572659825 L21.46047782418268 31.359972760794346 A38 38 0 0 1 7.0000000000000036 37.3496987939662 L7.0000000000000036 37.3496987939662 L7.000000000000004 47.3496987939662 L-6.999999999999999 47.3496987939662 L-7 37.3496987939662 A38 38 0 0 1 -21.46047782418268 31.35997276079435 L-21.46047782418268 31.35997276079435 L-28.531545636048154 38.431040572659825 L-38.43104057265982 28.531545636048158 L-31.359972760794346 21.460477824182682 A38 38 0 0 1 -37.3496987939662 7.000000000000007 L-37.3496987939662 7.000000000000007 L-47.3496987939662 7.000000000000008 L-47.3496987939662 -6.9999999999999964 L-37.3496987939662 -6.999999999999997 A38 38 0 0 1 -31.35997276079435 -21.460477824182675 L-31.35997276079435 -21.460477824182675 L-38.431040572659825 -28.531545636048147 L-28.53154563604818 -38.4310405726598 L-21.4604778241827 -31.35997276079433 A38 38 0 0 1 -6.999999999999992 -37.3496987939662 L-6.999999999999992 -37.3496987939662 L-6.999999999999994 -47.3496987939662 L6.999999999999977 -47.3496987939662 L6.999999999999979 -37.3496987939662 A38 38 0 0 1 21.460477824182686 -31.359972760794342 L21.460477824182686 -31.359972760794342 L28.531545636048158 -38.43104057265982 L38.4310405726598 -28.53154563604818 L31.35997276079433 -21.4604778241827 A38 38 0 0 1 37.3496987939662 -6.999999999999995 M0 -23A23 23 0 1 0 0 23 A23 23 0 1 0 0 -23\" fill=\"#d6d6d6\"></path></g></g></g><!-- [ldio] generated by https://loading.io/ --></svg>";