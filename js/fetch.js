console.log("fetch.js Initialized!");

function fetchImg(imgName, fileOriginNum, destinationSelector){
    fetch('/getImg?name='+imgName+'&origin='+fileOriginNum)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        $(destinationSelector)[0].src = data.uri;
    });
}
/*
//Loading Images 1-by-1 approach that didn't really work that well for the Astradux since it was too slow, but might work well for something in the future

console.log("fetchImg.js Initialized!");

function fetchImg(imgName, fileOriginNum, destinationSelector){
    fetch('/getImg?name='+imgName+'&origin='+fileOriginNum)
        .then(response => response.json())
        .then(data => {
        $(destinationSelector)[0].src = data.uri;
    });
}
var img_fetchQueue = [];
var fetchedImgs = 0;
function fetchQueuedImages(){
    fetch('/getImg?name='+img_fetchQueue[fetchedImgs][0]+'&origin='+img_fetchQueue[fetchedImgs][1])
        .then(response => response.json())
        .then(data => {
        $(img_fetchQueue[fetchedImgs][2])[0].src = data.uri;
        if(img_fetchQueue.length == fetchedImgs){  //base-case
            img_fetchQueue = [];
            fetchedImgs = 0;
        }else{
            fetchedImgs++;
            fetchQueuedImages();
            //for(var i = 0; i < img_fetchQueue.length; i++){
            //fetchImg(img_fetchQueue[i][0],img_fetchQueue[i][1],img_fetchQueue[i][2]);
            //}
        }
    });                   

}
*/
function fetch_n(callback){
    console.log("Fetching n...");
    fetch('/getn')
        .then(response => response.json())
        .then(data => {
        console.log("n fetched: "+ data);
        INVENTORYFiles_Count = eval(data);
        callback();
    });
}
function fetch_CATAGORIES(callback){
    console.log("Fetching CATAGORIES...");
    fetch('/getCATAGORIES')
        .then(response => response.json())
        .then(data => {
        console.log("CATAGORIES fetched: "+ data);
        catagories = eval(data);
        callback();
    });
}
function fetch_LOCATIONS(callback){
    console.log("Fetching LOCATIONS...");
    fetch('/getLOCATIONS')
        .then(response => response.json())
        .then(data => {
        console.log("LOCATIONS fetched: "+ data);
        locations = eval(data);
        callback();
    });
}
