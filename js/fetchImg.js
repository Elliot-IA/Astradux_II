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