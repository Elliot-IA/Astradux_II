console.log("fetchImg.js Initialized!");

function fetchImg(imgName, fileOriginNum, destinationSelector){
    fetch('/getImg?name='+imgName+'&origin='+fileOriginNum)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        $(destinationSelector)[0].src = data.uri;
    });/*
        .then(response => {$(destinationSelector)[0].src = response;})
        .then(data => console.log(data));    */
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