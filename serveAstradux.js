console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~serveAstradux.js initiated...~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

//#######     --Import Node Modules--     #######                 #######                 #######                 #######                 #######
const express = require("express"); 
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const imageDataURI = require("image-data-uri");
const https = require('https');
const url = require('url');

//#######     --Setup Express Port--     #######                 #######                 #######                 #######                 #######
app.use(express.static(path.join(__dirname, ".")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
    console.log("Server started on port 3000! Working Directory:"+path.join(__dirname, ".")+"\n");
    /*|>Start::*/  configureStandby();
});

//#######     --Connect To Databases--     #######                 #######                 #######                 #######                 #######
const { MongoClient, ServerApiVersion } = require('mongodb');
var account = "Ian_Alexander";

var totalConnections = 6;
var connections = 0;

const data_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@astradata.3dnfp.mongodb.net/?retryWrites=true&w=majority";
var astrasystem = "";
const astrasystem_client = new MongoClient(data_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs1_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.igwg5.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster1 = "";
const imagesCluster1_client = new MongoClient(imgs1_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs2_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.zchw9.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster2 = "";
const imagesCluster2_client = new MongoClient(imgs2_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs3_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.aj4lp.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster3 = "";
const imagesCluster3_client = new MongoClient(imgs3_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs4_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.jlei2.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster4 = "";
const imagesCluster4_client = new MongoClient(imgs4_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const imgs5_uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@cluster0.mludy.mongodb.net/?retryWrites=true&w=majority";
var imagesCluster5 = "";
const imagesCluster5_client = new MongoClient(imgs5_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function connectToDBs(){
    console.log("Connecting to Databases...");
    astrasystem_client.connect((res,err)=>{
        console.log("~Astrasystem Connection Established~");
        astrasystem = astrasystem_client.db(account);
        connections++;
        connectionTreshold();
    });
    imagesCluster1_client.connect((res,err)=>{
        console.log("~imagesCluster1 Connection Established~");
        imagesCluster1 = imagesCluster1_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster2_client.connect((res,err)=>{
        console.log("~imagesCluster2 Connection Established~");
        imagesCluster2 = imagesCluster2_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster3_client.connect((res,err)=>{
        console.log("~imagesCluster3 Connection Established~");
        imagesCluster3 = imagesCluster3_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster4_client.connect((res,err)=>{
        console.log("~imagesCluster4 Connection Established~");
        imagesCluster4 = imagesCluster4_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
    imagesCluster5_client.connect((res,err)=>{
        console.log("~imagesCluster5 Connection Established~");
        imagesCluster5 = imagesCluster5_client.db("database").collection("collection");
        connections++;
        connectionTreshold();
    });
}
var collectionConnections = [];
function connectionTreshold(){
    if(connections == totalConnections){
        startup();
        collectionConnections = [astrasystem, imagesCluster1, imagesCluster2, imagesCluster3, imagesCluster4, imagesCluster5]; 
    }
}

//#######     --Regenerate Files--     #######                 #######                 #######                 #######                 #######
function startup(){
    console.log("\nInitiating startup procedure...\n");
    regenerateLocImgs();
}
var processedImgs = 0;
var numImgs = null; 
function regenerateLocImgs(){
    astrasystem.collection("LOCATION_Images").find().toArray((error, imagesArray)=>{
        numImgs = imagesArray.length;
        console.log("Regenerating Location Images...\t("+numImgs+")");
        imagesArray.forEach((img)=>{
            generateImg(img.name, img.uri, "./LocationMap_Images/"+img.name);
        });
    });
}
async function generateImg(imgName, imgURI, imgPath){
    await imageDataURI.outputFile(imgURI, imgPath).then(res => {
        console.log("Location Img: "+imgName+" - done regenerating");
        processedImgs++;
        if(numImgs ==  processedImgs){
            console.log("v/ Location Image Regeneration Complete!\n");
            regenerateInvFiles();
        }
    });
}
function regenerateInvFiles(){
    astrasystem.collection("INVENTORY_Files").find().toArray((error, invFiles)=>{
        var numFiles = invFiles.length;
        console.log("Regenerating Inventory Files...\t("+numFiles+")");
        var processedFiles = 0;
        invFiles.forEach((file)=>{
            generateFile(file.name, file.data, "./Inventory_Files/"+file.name);
            processedFiles++;
            if(numFiles ==  processedFiles){
                console.log("v/ Inventory File Regeneration Complete!\n");
                regenerateDataFiles();
            }
        });
    });
}
function regenerateDataFiles(){
    astrasystem.collection("DATA_Files").find().toArray((error, dataFiles)=>{
        var numFiles = dataFiles.length;
        console.log("Regenerating Data Files...\t("+numFiles+")");
        var processedFiles = 0;
        dataFiles.forEach((file)=>{
            generateFile(file.name, file.data, "./Data_Files/"+file.name);
            processedFiles++;
            if(numFiles ==  processedFiles){
                console.log("v/ Data File Regeneration Complete!\n");
                configureRequests();
            }
        });
    });
}
function generateFile(fileName, fileContents, filePath){
    fs.writeFileSync(filePath, fileContents);
    console.log("Inv File: "+fileName+" - done regenerating");
}

//#######     --Configure GET and POST Handling--     #######                 #######                 #######                 #######                 #######
var regenerationInProgress = false;;
var preRegeneration = true;
function configureStandby(){
    console.log("Configuring GET Requests into pre-Regeneration mode...\nTo regenerate the Astradux's file structure, go to /beginStartup");

    app.get("/", function(req, res){
        if(preRegeneration){
            if(regenerationInProgress){
                res.send("!Please stand by, astrasystem file structure regenerating...");
            }else{
                res.send("To begin regenerating the astrasystem's file structure, please go to /beginStartup");
            }
        }else{
            res.sendFile(__dirname+"/Astradux.html");
            update_FILECOUNTjs();
        }
    });
    /*app.get("/beginStartup", function(req, res){
        if(regenerationInProgress){
            res.send("You've already started regenerated the astrasystem's file structure! - !Please stand by, astrasystem file structure regenerating...");
        }else{
            if(preRegeneration){
                regenerationInProgress = true;
                res.send("You've requested to regenerate the astrasystem's file structure, getting started...");
                */connectToDBs();/*
            }else{
                res.send("The Astradux's File System has already been regenerated and the Astradux is already fully online! </>");
            }
        }
    });*/

    app.get("/getImg", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log("query object: "+JSON.stringify(queryObject)+"--- file name:"+queryObject.name+"    origin: "+queryObject.origin);
        var clusterIndex = parseInt((queryObject.origin/5)+1);
        console.log("Retrieving image "+queryObject.name+"'s data uri from from datacluster "+clusterIndex+"...");
        collectionConnections[clusterIndex].findOne({name:queryObject.name},(error, data)=>{
            console.log("Image Found!");
            //console.log(data);
            //res.json(testObj);
            
            res.json(buildResponse(data.uri));
        });/*.catch(()=>{
            console.log("!!Something went wrong retrieving image "+queryObject.name+"'s uri from datacluster "+clusterIndex);
        });*/
    });
    app.get("*", function(req, res){
        if(regenerationInProgress){
            res.send("!Please stand by, astrasystem file structure regenerating...");
        }else if(preRegeneration){
            res.send("The astradux's file structure has not yet regenerated. To begin regenerating the astrasystem's file structure, please go to /beginStartup");
        }else{
            res.send("404!");
        }    
    });
}
const testObj = {
    "test1": {
        "1": "Hello there"
    }
}
function buildResponse(uri){
    return {"uri": uri}
}

function configureRequests(){
    console.log("Configuring GET and POST Requests\n");

    app.get(["/Astradux.html", "/"], function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/Astradux.html");
        update_FILECOUNTjs();
    });
    app.post(["/Astradux.html", "/"], function(req, res){
        if(req.body.command == "modData"){
            console.log("ModData from main.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.status(204).send();
        }else if(req.body.command == "setUpMod"){
            console.log("setUpMod Triggered: Part Data from main.js:" + req.body.data);
            setUpPartMod(req.body.data, eval(req.body.fileN));
            res.sendFile(__dirname+"/addPart.html");
        }else if(req.body.command == "resetSEARCHQUERY"){
            console.log("Emptying SEARCHQUERY.js");
            update_searchDATA(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "transfereLoc"){
            console.log("Transfering Location...");
            transfereLocation(req.body.data);
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from Astradux.html, but the command was not recognized");
        }
    });

    app.get("/addPart.html", function(req, res){
        res.sendFile(__dirname+"/addPart.html");
    });
    app.post("/addPart.html", function(req, res){
        if(req.body.command == "addCat"){
            console.log("catData from addPart.js:" + req.body.data);
            updateCatArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "addPart"){
            console.log("partData from addPart.js:" + req.body.data);
            addPart(req.body.data, true, res);
        }else if(req.body.command == "addPart_URI"){
            var filePath = req.body.timestamp;
            var dataURI = req.body.uri;
            console.log("Timestamp: "+req.body.timestamp);
            console.log("URI: "+req.body.uri);
            storeImage(filePath, dataURI);
            imageDataURI.outputFile(dataURI, "./Inventory_Images/"+filePath)
            // RETURNS image path of the created file 'out/path/fileName.png'
                .then(res => console.log(res));
            addPart(req.body.data, true, res);
        }else if(req.body.command == "updateLOCs"){
            console.log("locData from addPart.js:" + req.body.data);
            updateLocArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "ModPartData"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "undoAdd"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.sendFile("."+"/Astradux.html");
        }else if(req.body.command == "wipeModData"){
            console.log("Wiping MODDATA clean...");
            wipeModData();
            res.status(204).send();
        }else if(req.body.command == "sendUserHome"){
            res.sendFile(__dirname+"/Astradux.html");
        }else{
            console.log("(!)A post request was made from addPart.html, but the command was not recognized");
        }
    });

    app.get("/catagoryMap.html", function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/catagoryMap.html");
    });
    app.post("/catagoryMap.html", function(req, res){
        if(req.body.command == "addCat"){
            console.log("catData from displayCatagories.js:" + req.body.data);
            updateCatArray(req.body.data)
            res.status(204).send();
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.sendFile(__dirname+"/Astradux.html");
        }else{
            console.log("(!)A post request was made from catagoryMap.html, but the command was not recognized");
        }
    });

    regenerationInProgress = false;
    preRegeneration = false;
    console.log("</> CONFIGURATION COMPLETE, ASTRADUX ONLINE </>\n");
}


//#######     --Action Definitions--     #######                 #######                 #######                 #######                 #######
const getAllDirFiles = function(dirPath, arrayOfFiles){     //This is used to look inside folders at the actual files & file names
    files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}
update_FILECOUNTjs();

var dataSafeBox = "";
function addPart(partData, firstTime, res){
    var n = getAllDirFiles("./Inventory_Files").length;
    var partDataAddedTo_fileNum = n;
    //console.log("Number of Inventory Files: " + n);
    var nthFile_content = fs.readFileSync("./Inventory_Files/INVENTORY"+n+".js").toString();
    //console.log("nthFile_content: "+ nthFile_content);
    var nthFile_contentArray = nthFile_content.split("\n");
    //console.log("nthFile_contentArray: "+ nthFile_contentArray);
    var partsIn_nthFile = nthFile_contentArray.length-4;
    //console.log("indexesIn_nthFile: "+ partsIn_nthFile);
    var newFile = false;

    if(partsIn_nthFile >= 100){
        findSpace:{
            for(var i = n; i > 0; i--){
                var ithFile_content = fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString();
                if(firstTime) dataSafeBox = ithFile_content;
                var ithFile_contentArray = ithFile_content.split("\n");
                var partsIn_ithFile = ithFile_content.length-4;
                if(partsIn_ithFile < 100){
                    ithFile_contentArray[ithFile_contentArray.length-4] += ",";
                    ithFile_contentArray.splice(ithFile_contentArray.length-3, 0, "\t"+eval(partData));
                    ithFile_content = ithFile_contentArray.join("\n");
                    fs.writeFileSync("./Inventory_Files/INVENTORY"+i+".js", ithFile_content);
                    astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+i+".js"}, { $set: {data: ithFile_content}} );          //DB
                    partDataAddedTo_fileNum = i;
                    break findSpace;
                }
            }
            var xthFile_contentArray = newINVENTORY_File_structure.split("\n");
            var xthFile_content = xthFile_contentArray.join("\n");
            fs.writeFileSync("./Inventory_Files/INVENTORY"+(n+1)+".js", xthFile_content);
            astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+(n+1)+".js"}, {$set: {data: xthFile_content}});    //DB
            partDataAddedTo_fileNum = n+1;
            update_FILECOUNTjs();
            setUpPartMod("", n+1);
        }
        newFile = true;
    }
    n = getAllDirFiles("./Inventory_Files").length;
    partDataAddedTo_fileNum = n;
    //console.log("Number of Inventory Files: " + n);
    nthFile_content = fs.readFileSync("./Inventory_Files/INVENTORY"+n+".js").toString();
    if(firstTime) dataSafeBox = nthFile_content;
    //console.log("nthFile_content: "+ nthFile_content);
    nthFile_contentArray = nthFile_content.split("\n");
    //console.log("nthFile_contentArray: "+ nthFile_contentArray);
    partsIn_nthFile = nthFile_contentArray.length-4;
    //console.log("indexesIn_nthFile: "+ partsIn_nthFile);

    if(!newFile) nthFile_contentArray[nthFile_contentArray.length-4] += ",";
    nthFile_contentArray.splice(nthFile_contentArray.length-3, 0, "\t"+eval(partData));
    //console.log("Revised nthFile_contentArray: "+nthFile_contentArray);
    nthFile_content = nthFile_contentArray.join("\n");
    //console.log("File data being loaded into INVENTORY"+n+".js:\n "+nthFile_content);
    fs.writeFileSync("./Inventory_Files/INVENTORY"+n+".js", nthFile_content);
    astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+n+".js"}, {$set: {data: nthFile_content}});    //DB
    setUpPartMod("", n);

    try{
        var rerunCheckArray = fs.readFileSync("./Inventory_Files/INVENTORY"+partDataAddedTo_fileNum+".js").toString().split("\n");
        rerunCheckArray[rerunCheckArray.length-1] = "";
        eval(rerunCheckArray.join("\n"));
        console.log("INVENTORY_File"+partDataAddedTo_fileNum+" confirmed to still be valid and uncorrupted");
        res.status(204).send();
    }catch{
        if(firstTime){
            console.log("(!)Uh oh, data corruption or invalid characters detected in INVENTORY_File"+partDataAddedTo_fileNum+", attempting to repair...");

            setTimeout(()=>{
                addPart(partData, false, res);
            },100);
        }else{
            res.status(500).send();
            throw "Data in INVENTORY_File"+partDataAddedTo_fileNum+" was corruption or had invalid characters and an attempted repair was unsuccessful. Here is data salvaged from that Inventory File before it was re-written:\n\n"+dataSafeBox;
        }
    }

    console.log("Part data added to file:  INVENTORY"+partDataAddedTo_fileNum+".js");
}
var newINVENTORY_File_structure = "var InventoryFragment = [   //  [partname_0, location_1, catagory_2, [tags_3, ...], quantity_4, imageURL_5, isBin?_6  (+ discription_7)]   //\n];\n\ndocument.querySelector(\"meta[name=InventoryDATA]\").setAttribute(\"content\", JSON.stringify(InventoryFragment));";

function updateCatArray(newCatArray){
    var CAT_content = fs.readFileSync("./Data_Files/CATAGORIES.js").toString();
    var CAT_array = CAT_content.split("\n");
    CAT_array.splice(0, 1, "var catagories = "+ newCatArray +";");
    CAT_content = CAT_array.join("\n");
    fs.writeFileSync("./Data_Files/CATAGORIES.js", CAT_content);
    astrasystem.collection("DATA_Files").updateOne({name: "CATAGORIES.js"}, {$set: {data: CAT_content}});    //DB
    console.log("Cat Array Updated");
}

function updateLocArray(newLocArray){
    var LOC_content = fs.readFileSync("./Data_Files/LOCATIONS.js").toString();
    var LOC_array = LOC_content.split("\n");
    LOC_array.splice(0, 1, "var locations = "+ newLocArray +";");
    LOC_content = LOC_array.join("\n");
    fs.writeFileSync("./Data_Files/LOCATIONS.js", LOC_content);
    astrasystem.collection("DATA_Files").updateOne({name: "LOCATIONS.js"}, {$set: {data: LOC_content}});     //DB
    console.log("Loc Array Updated");
}

function modifyPartData(File_and_Data, res){
    var split1 = File_and_Data.indexOf(":");   //This'll work even if there's another ":" in the part data
    var split2 = File_and_Data.indexOf(">=-:-=>");
    var INVENTORY_file = File_and_Data.substring(0, split1);
    var old_partData = File_and_Data.substring(split1+1, split2-1);
    console.log(old_partData);
    var new_partData = File_and_Data.substring(split2+7, File_and_Data.length);
    var FRAG_content = fs.readFileSync("./Inventory_Files/"+INVENTORY_file+".js").toString();
    var FRAG_array = FRAG_content.split("\n");
    Loop:{
        for(var i = 0; i < FRAG_array.length; i++){
            if(FRAG_array[i].indexOf(old_partData) != -1){
                console.log("Part Index Identified!");
                console.log("Placement in FRAG_array: line " +(i+1)+" of "+FRAG_array.length);

                if(new_partData == "[]"){
                    FRAG_array.splice(i, 1);
                    if(i == FRAG_array.length-3){
                        console.log("Looks like this is the last element in the INVENTORY File, deleting preceeding comma...");
                        FRAG_array.splice(i-1, 1, FRAG_array[i-1].substring(0,FRAG_array[i-1].length-1));
                    }
                }else{
                    if(FRAG_array[i].charAt(FRAG_array[i].length-1) == ","){
                        FRAG_array.splice(i, 1, "\t"+new_partData+",");
                    }else{
                        FRAG_array.splice(i, 1, "\t"+new_partData);
                    }
                }
                FRAG_content = FRAG_array.join("\n");
                fs.writeFileSync("./Inventory_Files/"+INVENTORY_file+".js", FRAG_content);
                astrasystem.collection("INVENTORY_Files").updateOne({name: INVENTORY_file+".js"}, {$set: {data: FRAG_content}});    //DB
                console.log("A part in file "+INVENTORY_file+" was modified");
                break Loop;
            }
        }
        console.log("A part Modification in file "+INVENTORY_file+" was attempted but no part matching the given old_partData was found");
        res.status(204).send();
    }
};

function setUpPartMod(newData, n){
    var modDataContents = fs.readFileSync("./js/MODDATA.js").toString();
    modDataArray = modDataContents.split("\n");
    modDataArray.splice(0, 1, "var partData = \""+newData+"\";");
    modDataArray.splice(1, 1, "var INVENTORY_FileToMod = "+n+";");
    modDataContents = modDataArray.join("\n");
    fs.writeFileSync("./js/MODDATA.js", modDataContents);
    console.log("MODDATA.js Modified");
}
function wipeModData(){
    var modDataContents = fs.readFileSync("./js/MODDATA.js").toString();
    modDataArray = modDataContents.split("\n");
    modDataArray.splice(0, 1, "var partData = \"\";");
    modDataArray.splice(1, 1, "var INVENTORY_FileToMod = 0;");
    modDataContents = modDataArray.join("\n");
    fs.writeFileSync("./js/MODDATA.js", modDataContents);
    console.log("MODDATA.js Wiped");
}
function update_searchDATA(newData){
    var searchDataContents = fs.readFileSync("./js/SEARCHQUERY.js").toString();
    modDataArray = searchDataContents.split("\n");
    modDataArray.splice(0, 1, "var searchData = "+newData+";");
    searchDataContents = modDataArray.join("\n");
    fs.writeFileSync("./js/SEARCHQUERY.js", searchDataContents);
    console.log("SEARCHQUERY.js Modified");
}
function update_FILECOUNTjs(){
    var n = getAllDirFiles("./Inventory_Files").length;
    var FILECOUNT_content = fs.readFileSync("./js/FILECOUNT.js").toString();
    var FILECOUNT_contentArray = FILECOUNT_content.split("\n"); 
    FILECOUNT_contentArray.splice(0, 1, "var inventoryFiles_Count = "+n+";");
    FILECOUNT_content = FILECOUNT_contentArray.join("\n");
    fs.writeFileSync("./js/FILECOUNT.js", FILECOUNT_content);
}
function transfereLocation(locData){
    var split = locData.indexOf(">=-:-=>");
    var oldLoc = locData.substring(0, split);
    var newLoc = locData.substring(split+7, locData.length);
    for(var i = 1; i <= getAllDirFiles("./Inventory_Files").length; i++){    //for(every inventory file)
        var FRAG_content = fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString();   //convert to a string
        //console.log("\n\nINVENTORY"+i+" before loc transfere: "+FRAG_content);
        var oldLoc_Globalified = new RegExp(oldLoc, "g");
        var newFrag = FRAG_content.replace(oldLoc_Globalified, newLoc);
        fs.writeFileSync("./Inventory_Files/INVENTORY"+i+".js", newFrag);  //just replace all instances of oldLoc with newLoc using a JS method and save
        astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+i+".js"}, {$set: {data: newFrag}});    //DB
        //console.log("\n\nINVENTORY"+i+" after loc transfere: "+fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString());
    }
    console.log("Location "+oldLoc+" changed to "+newLoc+"    ("+getAllDirFiles("./Inventory_Files").length+" INVENTORY files detected)");
}
function storeImage(name, URI){
    if(URI != ""){
        astrasystem.collection("INVENTORY_Images").insertOne({"name":name, "uri":URI});
    }
}
function closeProgram(){
    console.log("Program Complete");
    process.exit(0);
}




