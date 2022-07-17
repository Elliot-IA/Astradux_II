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
const imageToUri = require('image-to-uri');

var n = null;
var MASTER_INVENTORY = {};
//var MASTER_INVENTORY_vnums = {};
var CATAGORIES = null;
var LOCATIONS = null;

//#######     --Setup Express Port--     #######                 #######                 #######                 #######                 #######
app.use(express.static(path.join(__dirname, ".")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
/*app.use((req, res, next) => {
    res.append('Cache-Control', 'no-cache');
    //res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.append('Access-Control-Allow-Headers', 'Content-Type');
    //next();
});*/
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
    update_FILECOUNTjs();
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
        console.log("Storing Inventory into MASTER_INVENTORY object...\t("+numFiles+")");
        var processedFiles = 0;
        invFiles.forEach((file)=>{
            //generateFile(file.name, file.data, "./Inventory_Files/"+file.name);
            console.log("Collecting "+file.name+"...");
            MASTER_INVENTORY[file.name] = file.data;
            processedFiles++;
            if(numFiles ==  processedFiles){
                console.log("v/ Inventory File Regeneration Complete!\n");
                //regenerateDataFiles();
                collect_ASTRAGLOBALS();
            }
        });
        console.log("result: "+JSON.stringify(MASTER_INVENTORY).substring(0,30));
    });
}

//#######     --Configure GET and POST Handling--     #######                 #######                 #######                 #######                 #######

function collect_ASTRAGLOBALS(){
    console.log("Grabing CATAGORIES & LOCATIONS from MongoDB and storing in global varibles...");
    astrasystem.collection("GLOBALS").find({"name": "catagoryMap"}).toArray((error, catData)=>{
        CATAGORIES = catData;
        astrasystem.collection("GLOBALS").find({"name": "locationMap"}).toArray((error, locData)=>{
            LOCATIONS = locData;
            console.log("v/ CATAGORIES & LOCATIONS collected and stored!\n");
            generateSytleFiles();
        });
    });
}

/*function regenerateDataFiles(){
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
}*/
function generateFile(fileName, fileContents, filePath){
    fs.writeFileSync(filePath, fileContents);
    console.log("Inv File: "+fileName+" - done regenerating");
}

function generateSytleFiles(){
    console.log("Generating Style_Files (CSS & JS)...");
    console.log("Style parameters pulled from colors.json: ");
    var colorsJSON_fileContent = fs.readFileSync("./Style_File/colors.json").toString();
    console.log(colorsJSON_fileContent);
    console.log(typeof(colorsJSON_fileContent));
    var colorsJSON_parsed = JSON.parse(colorsJSON_fileContent)[0];
    console.log(colorsJSON_parsed);
    console.log(typeof(colorsJSON_parsed));
    var colorsJSON_stringified = JSON.stringify(colorsJSON_parsed);
    console.log(colorsJSON_stringified);
    console.log(typeof(colorsJSON_stringified));
    
    var str = '[{"UserName":"xxx","Rolename":"yyy"}]'; // your response in a string
    var parsed = JSON.parse(str); // an *array* that contains the user
    var user = parsed[0];         // a simple user
    console.log(user.UserName);   // you'll get xxx
    console.log(user.Rolename);   // you'll get yyy
    
    var colorsCSS_fileStructure = "#toolTitle,#goHome,#toolbox_label,#topbar,#createPathwayButton{\nbackground-color: "+colorsJSON_parsed.primaryColor+";\ncolor: "+colorsJSON_parsed.primaryTextColor+";\n}\n#cat1,#cat2,#cat3,#cat4,#AAPcat{\nbackground-color: "+colorsJSON_parsed.branchColor+";\ncolor: "+colorsJSON_parsed.branchTextColor+";\n}\n#cat1:hover,#cat2:hover,#cat3:hover,#cat4:hover,#AAPcat:hover{\nbackground-color: "+colorsJSON_parsed.branchHoverColor+";\n}\n#cat1_end,#cat2_end,#cat3_end,#cat4_end,#AAPcat_end{\nbackground-color: "+colorsJSON_parsed.leafColor+";\ncolor: "+colorsJSON_parsed.leafTextColor+";\n}\n#cat1_end:hover,#cat2_end:hover,#cat3_end:hover,#cat4_end:hover,#AAPcat_end:hover{\nbackground-color: "+colorsJSON_parsed.leafHoverColor+";z\n}\#goHome:hover,.onPage{\nbackground-color: "+colorsJSON_parsed.onPageColor+";\n}";
    var colorsJS_fileStructure = "";
    fs.writeFileSync("./Style_File/colors.css", colorsCSS_fileStructure);
    fs.writeFileSync("./Style_File/colors.js", colorsJS_fileStructure);
    console.log("v/ Style_Files Generated!");

    configureRequests();
}
//Pull in colors from JSON file


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
        console.log("---Image Fetch Request: query object: "+JSON.stringify(queryObject)+" --- file name:"+queryObject.name+"    origin: "+queryObject.origin);
        var clusterIndex = parseInt((queryObject.origin/5)+1);
        console.log("---Retrieving image "+queryObject.name+"'s data uri from from datacluster "+clusterIndex+"...");
        collectionConnections[clusterIndex].findOne({name:queryObject.name},(error, data)=>{
            if(data == null){
                console.log("---(!) Image "+queryObject.name+" does not exist in datacluster "+clusterIndex);
                var questionMarkURI = imageToUri("./Images/missingImg.png");
                res.json(buildImgResponse(questionMarkURI));
            }else{
                console.log("---Image Found!");
                res.json(buildImgResponse(data.uri));
            }
        });
    });
    app.get("/getINV", function(req, res){
        var queryObject = url.parse(req.url,true).query;
        console.log(">>>Invenotry Fetch Request: query object: "+JSON.stringify(queryObject)+" <<->> file name: "+queryObject.i);
        console.log(">>>Retrieving Inventory Fragment "+queryObject.i+"...");
        astrasystem.collection("INVENTORY_Files").findOne({name:"INVENTORY"+queryObject.i},(error, data)=>{
            if(data == null){
                console.log(">>>(!) INVENTORY"+queryObject.i+" does not exist in database!");
                res.json([["BAD FETCH", "____", "_____", ["____"], "_____", "", false]]);
            }else{
                console.log(">>>INVENTORY"+queryObject.i+" Found!");
                res.json(buildInvResponse(data.data));
            }
        });
    });
    app.get("/getn", function(req, res){
        res.json(n);
    });
    app.get("/getCATAGORIES", function(req, res){
        astrasystem.collection("GLOBALS").findOne({name:"catagoryMap"},(error, data)=>{
            if(data == null){
                console.log("-<>-(!) count not fetch CATAGORIES!");
            }else{
                console.log("-<>-fetched CATAGORIES!");
                res.json(data.data);
            }
        });
    });
    app.get("/getLOCATIONS", function(req, res){
        astrasystem.collection("GLOBALS").findOne({name:"locationMap"},(error, data)=>{
            if(data == null){
                console.log("-<>-(!) count not fetch LOCATIONS!");
            }else{
                console.log("-<>-fetched LOCATIONS!");
                res.json(data.data);
            }
        });
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
function buildImgResponse(uri){
    return {"uri": uri}
}
function buildInvResponse(frag){
    return {"inv": frag}
}

function configureRequests(){
    console.log("Configuring GET and POST Requests\n");

    app.get(["/Astradux.html", "/"], function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/Astradux.html");
        update_FILECOUNTjs();
    });
    app.post(["/Astradux.html", "/"], function(req, res){
        console.log("Incomming Post from /Astradux.html, command: "+req.body.command);
        if(req.body.command == "modData"){
            console.log("ModData from main.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.status(204).send();
        }/*else if(req.body.command == "setUpMod"){
            console.log("setUpMod Triggered: Part Data from main.js:" + req.body.data);
            setUpPartMod(req.body.data, eval(req.body.fileN));
            res.status(204).send();
            //res.sendFile(__dirname+"/addPart.html");
        }*/else if(req.body.command == "resetSEARCHQUERY"){
            console.log("Emptying SEARCHQUERY.js");
            update_searchDATA(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "transfereLoc"){
            console.log("Transfering Location...");
            transfereLocation(req.body.data);
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from Astradux.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from Astradux.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });

    app.get("/addPart.html", function(req, res){
        res.sendFile(__dirname+"/addPart.html");
    });
    app.post("/addPart.html", function(req, res){
        console.log("Incomming Post from /addPart.html, command: "+req.body.command);
        if(req.body.command == "addCat"){
            console.log("catData from addPart.js:" + req.body.data);
            updateCatArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "addPart"){
            console.log("Processing addPart requset (no URI)...");
            console.log("partData from addPart.js:" + req.body.data);
            addPart(req.body.data, true, res);
            console.log("v/ addPart requset (no URI) processed!");
        }else if(req.body.command == "addPart_URI"){
            console.log("Processing addPart_URI requset...");
            var filePath = req.body.timestamp;
            var dataURI = req.body.uri;
            console.log("Timestamp: "+req.body.timestamp);
            console.log(("URI: "+req.body.uri).substring(0,30));
            storeImage(filePath, dataURI, "invImg");
            /*imageDataURI.outputFile(dataURI, "./Inventory_Images/"+filePath)      //Old save to local storage code
            // RETURNS image path of the created file 'out/path/fileName.png'
                .then(res => console.log(res));*/
            addPart(req.body.data, true, res);
            console.log("v/ addPart_URI requset processed!");
        }else if(req.body.command == "updateLOCs"){
            console.log("locData from addPart.js:" + req.body.data);
            updateLocArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "ModPartData"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
            res.status(204).send();
            //res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "undoAdd"){
            console.log("Modifing Part Data. ModData from addPart.js: " + req.body.data);
            modifyPartData(req.body.data, res);
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.status(204).send();

            //res.sendFile("."+"/Astradux.html");
        }else if(req.body.command == "wipeModData"){
            console.log("Wiping MODDATA clean...");
            wipeModData();
            res.status(204).send();
        }else if(req.body.command == "sendUserHome"){
            res.status(204).send();
            //res.sendFile(__dirname+"/Astradux.html");
        }else if(req.body.command == "saveLocImg"){
            console.log("Processing requset to store a new Location_Image...");
            var filePath = req.body.timestamp;
            var dataURI = req.body.uri;
            console.log("Loc Img src: "+req.body.timestamp);
            console.log(("URI: "+req.body.uri).substring(0,30));
            storeImage(filePath, dataURI, "locImg");
            imageDataURI.outputFile(dataURI, "./LocationMap_Images/"+filePath).then(res => {
                console.log("Location Img: "+filePath+" - done generating");
            });
            res.status(204).send();
        }else{
            console.log("(!)A post request was made from addPart.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from addPart.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
        }
    });

    app.get("/catagoryMap.html", function(req, res){   //(request, response) hey callbacks!
        res.sendFile(__dirname+"/catagoryMap.html");
    });
    app.post("/catagoryMap.html", function(req, res){
        console.log("Incomming Post from /catagoryMap.html. req body: "+JSON.stringify(req.body));
        if(req.body.command == "addCat"){
            console.log("catData from displayCatagories.js:" + req.body.data);
            updateCatArray(req.body.data);
            res.status(204).send();
        }else if(req.body.command == "triggerForignSearch"){
            console.log("Forign search Triggered from addPart");
            update_searchDATA(req.body.data);
            res.sendFile(__dirname+"/Astradux.html");
        }else{
            console.log("(!)A post request was made from catagoryMap.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
            res.send("(!)A post request was made from catagoryMap.html, but the command was not recognized. Command: "+ req.body.command+" Data: "+ req.body.data);
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
//update_FILECOUNTjs();



function addPart(partData, firstTime, res){
    astrasystem.collection("INVENTORY_Files").find().toArray((error, fragArray)=>{
        n = fragArray.length;
        console.log("reading number of fragments: "+n);
        if(n == 0){
            console.log("Wow! This is your first Inventory Fragment! Creating it now...");
            MASTER_INVENTORY["INVENTORY1"] = "[]";
            astrasystem.collection("INVENTORY_Files").insertOne({name: "INVENTORY1", data:"[]"/*, version: 0*/} );          //DB
            n=1;
        }
        var partDataAddedTo_fileNum = n;
        var nthFile_content = MASTER_INVENTORY["INVENTORY"+n];//fs.readFileSync("./Inventory_Files/INVENTORY"+n+".js").toString();
        var partsIn_nthFile = eval(nthFile_content).length;//nthFile_contentArray.length-4;
        var newFile = false;
        if(partsIn_nthFile >= 100){
            findSpace:{
                for(var i = n; i > 0; i--){ //Look for an existing INVENTORY Fragment with space vv
                    var ithFile_content = MASTER_INVENTORY["INVENTORY"+i];
                    console
                    var partsIn_ithFile = ithFile_content.length;//ithFile_content.length-4;
                    if(partsIn_ithFile < 100){
                        partDataAddedTo_fileNum = i;
                        break findSpace;
                    }
                }
                astrasystem.collection("INVENTORY_Files").insertOne({name: "INVENTORY"+(n+1), data:"[]"/*, version: 0*/} );          //DB
                n++;
                MASTER_INVENTORY["INVENTORY"+n] = "[]";
                partDataAddedTo_fileNum = n;
            }
            newFile = true;
        }
        var fragmentStr = "INVENTORY"+partDataAddedTo_fileNum;
        console.log("fragmentStr: "+ fragmentStr);
        var fragmentToAppendTo = MASTER_INVENTORY[fragmentStr];
        console.log("fragmentToAppendTo before append: "+fragmentToAppendTo);
        var tempArray = eval(fragmentToAppendTo);
        tempArray.push(eval(eval(partData)));
        var appendedFragment = JSON.stringify(tempArray);
        console.log("fragmentToAppendTo after append: "+appendedFragment);
        MASTER_INVENTORY[fragmentStr] = tempArray;
        astrasystem.collection("INVENTORY_Files").updateOne({name: fragmentStr}, {$set: {data: appendedFragment}}/*, {$inc:{v:1}}*/);    //DB
    });
}

function updateCatArray(newCatArray){
    console.log("updateCatArray initiated...");
    /*var CAT_content = fs.readFileSync("./Data_Files/CATAGORIES.js").toString();
    var CAT_array = CAT_content.split("\n");
    CAT_array.splice(0, 1, "var catagories = "+ newCatArray +";");
    CAT_content = CAT_array.join("\n");
    fs.writeFileSync("./Data_Files/CATAGORIES.js", CAT_content);*/
    CATAGORIES = newCatArray;
    astrasystem.collection("GLOBALS").updateOne({name: "catagoryMap"}, {$set: {data: newCatArray}}).then((err,data)=>{
        console.log("Cat Array Updated! Is now: "+CATAGORIES);    
    });    //DB
}

function updateLocArray(newLocArray){
    console.log("updateCatArray initiated...");
    /*var LOC_content = fs.readFileSync("./Data_Files/LOCATIONS.js").toString();
    var LOC_array = LOC_content.split("\n");
    LOC_array.splice(0, 1, "var locations = "+ newLocArray +";");
    LOC_content = LOC_array.join("\n");
    fs.writeFileSync("./Data_Files/LOCATIONS.js", LOC_content);*/
    LOCATIONS = newLocArray;
    astrasystem.collection("GLOBALS").updateOne({name: "locationMap"}, {$set: {data: newLocArray}}).then((err,data)=>{
        console.log("Loc Array Updated! Is now: "+LOCATIONS);    
    });    //DB
}

function modifyPartData(File_and_Data, res){
    var split1 = File_and_Data.indexOf(":");   //This'll work even if there's another ":" in the part data
    console.log("split1: "+split1);
    var split2 = File_and_Data.indexOf(">=-:-=>");
    console.log("split2: "+split2);
    var INVENTORY_file = File_and_Data.substring(0, split1);
    console.log("INVENTORY_file: "+INVENTORY_file);
    var old_partData_str = File_and_Data.substring(split1+1, split2);
    console.log("old_partData_str: " + old_partData_str);
    var old_partData = eval(old_partData_str);
    console.log(old_partData);
    var new_partData = File_and_Data.substring(split2+7, File_and_Data.length);
    console.log(new_partData);
    //var FRAG_content = fs.readFileSync("./Inventory_Files/"+INVENTORY_file+".js").toString();
    //var FRAG_array = FRAG_content.split("\n");
    astrasystem.collection("INVENTORY_Files").find({name:INVENTORY_file}).toArray((error, data)=>{
        console.log("data from inventory: "+JSON.stringify(data));
        var FRAG_array = eval(data[0].data);
        console.log("FRAG_array: "+FRAG_array);
        Loop:{
            for(var i = 0; i < FRAG_array.length; i++){
                var FRAG_array_str = JSON.stringify(FRAG_array[i]);
                var old_partData_str = JSON.stringify(old_partData);
                if(FRAG_array_str == old_partData_str){
                    console.log(FRAG_array_str +"=="+ old_partData_str);
                    console.log("Part Index Identified!");
                    console.log("Placement in FRAG_array: line " +(i+1)+" of "+FRAG_array.length);
                    
                    console.log("\nFragment before mod: "+ JSON.stringify(FRAG_array));

                    if(new_partData == "[]"){
                        FRAG_array.splice(i, 1);
                        /*if(i == FRAG_array.length-3){
                            console.log("Looks like this is the last element in the INVENTORY File, deleting preceeding comma...");
                            FRAG_array.splice(i-1, 1, FRAG_array[i-1].substring(0,FRAG_array[i-1].length-1));
                        }*/
                    }else{
                        /*if(FRAG_array[i].charAt(FRAG_array[i].length-1) == ","){
                            FRAG_array.splice(i, 1, "\t"+new_partData+",");
                        }else{
                            FRAG_array.splice(i, 1, "\t"+new_partData);
                        }*/
                        FRAG_array.splice(i, 1, eval(new_partData));
                    }
                    //FRAG_content = FRAG_array.join("\n");
                    //fs.writeFileSync("./Inventory_Files/"+INVENTORY_file+".js", FRAG_content);
                    var result = JSON.stringify(FRAG_array);
                    
                    console.log("\nFragment after mod: "+ result+"\n");
                    
                    MASTER_INVENTORY[INVENTORY_file] = result;
                    astrasystem.collection("INVENTORY_Files").updateOne({name: INVENTORY_file}, {$set: {data: result}});    //DB
                    console.log("A part in file "+INVENTORY_file+" was modified");
                    break Loop;
                }else{
                    console.log(FRAG_array_str +"    !=    "+ old_partData_str+"\n");
                }
            }
            console.log("A part Modification in fragment "+INVENTORY_file+" was attempted but no part matching the given old_partData was found");
        }
    });
}

/*function setUpPartMod(newData, n){
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
}*/
function update_FILECOUNTjs(){
    console.log("Updating File count...");
    astrasystem.collection("INVENTORY_Files").find().toArray((error, dataFiles)=>{
        n = dataFiles.length;
        console.log("v/ File count updated");
    });
}
function transfereLocation(locData){
    var split = locData.indexOf(">=-:-=>");
    var oldLoc = locData.substring(0, split);
    var newLoc = locData.substring(split+7, locData.length);
    var oldLoc_Globalified = new RegExp(oldLoc, "g");

    astrasystem.collection("INVENTORY_Files").find().toArray((error, data)=>{
        data.forEach((frag)=>{
            astrasystem.collection("INVENTORY_Files").updateOne({name: frag.name}, {$set: {data: frag.data.replace(oldLoc_Globalified, newLoc)}});
            /*for(var i = 1; i <= getAllDirFiles("./Inventory_Files").length; i++){    //for(every inventory file)
        var FRAG_content = fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString();   //convert to a string
        //console.log("\n\nINVENTORY"+i+" before loc transfere: "+FRAG_content);
        var oldLoc_Globalified = new RegExp(oldLoc, "g");
        var newFrag = FRAG_content.replace(oldLoc_Globalified, newLoc);
        //fs.writeFileSync("./Inventory_Files/INVENTORY"+i+".js", newFrag);  //just replace all instances of oldLoc with newLoc using a JS method and save
        astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"}, {$set: {data: newFrag}});    //DB
        //console.log("\n\nINVENTORY"+i+" after loc transfere: "+fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString());
    }*/

        });
        console.log("Location "+oldLoc+" changed to "+newLoc+"    ("+data.length+" INVENTORY fragments detected)");
    });
}
function storeImage(name, URI, type){
    if(type == "invImg"){
        var clusterIndex = parseInt((n/5)+1);
        console.log("Saving image "+name+"'s data uri ("+URI.substring(0,30)+") to datacluster "+clusterIndex+"...");
        collectionConnections[clusterIndex].insertOne({
            name:name,
            uri: URI
        },(error, data)=>{
            if(data == null){
                console.log("(!) Unable to add inv image to data cluster: "+clusterIndex);
            }else{
                console.log("Image added to data cluster: "+clusterIndex);
            }
        });
    }else if(type == "locImg"){
        astrasystem.collection("LOCATION_Images").insertOne({
            name:name,
            uri: URI
        },(error, data)=>{
            if(data == null){
                console.log("(!) Unable to add loc image to data cluster: "+clusterIndex);
            }else{
                console.log("Location_Image "+name+" added to database!");
            }
        });
    }

    /*if(URI != ""){
        astrasystem.collection("INVENTORY_Images").insertOne({"name":name, "uri":URI});
    }*/
}
function closeProgram(){
    console.log("Program Complete");
    process.exit(0);
}
























////////////////////////////////////JUNKYARD//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var dataSafeBox = "";
function depreciated_addPart(partData, firstTime, res){
    astrasystem.collection("INVENTORY_Files").find().toArray((error, invFiles)=>{
        n = invFiles.length;
        console.log("reading number of fragments: "+n);
        if(n == 0){
            console.log("Wow! This is your first Inventory Fragment! Creating it now...");
            //fs.writeFileSync("./Inventory_Files/INVENTORY1", newINVENTORY_File_structure);
            astrasystem.collection("INVENTORY_Files").insertOne({name: "INVENTORY1", data:"[]"/*, version: 0*/} );          //DB
            n=1;
        }
        var partDataAddedTo_fileNum = null;
        //console.log("Number of Inventory Files: " + n);
        var nthFile_content = eval("MASTER_INVENTORY.INVENTORY"+n);//fs.readFileSync("./Inventory_Files/INVENTORY"+n+".js").toString();
        //console.log("nthFile_content: "+ nthFile_content);
        //var nthFile_contentArray = nthFile_content.split("\n");
        //console.log("nthFile_contentArray: "+ nthFile_contentArray);
        var partsIn_nthFile = eval(MASTER_INVENTORY["INVENTORY"+n]).length;//nthFile_contentArray.length-4;
        //console.log("indexesIn_nthFile: "+ partsIn_nthFile);
        var newFile = false;

        if(partsIn_nthFile >= 100){
            findSpace:{
                for(var i = n; i > 0; i--){ //Look for an existing INVENTORY Fragment with space vv
                    //var ithFile_content = fs.readFileSync("./Inventory_Files/INVENTORY"+i+".js").toString();
                    if(firstTime) dataSafeBox = eval(eval("MASTER_INVENTORY.INVENTORY"+n));//ithFile_content;
                    //var ithFile_contentArray = ithFile_content.split("\n");
                    var partsIn_ithFile = eval(MASTER_INVENTORY["INVENTORY"+i]).length;//ithFile_content.length-4;
                    if(partsIn_ithFile < 100){
                        /*ithFile_contentArray[ithFile_contentArray.length-4] += ",";
                        ithFile_contentArray.splice(ithFile_contentArray.length-3, 0, "\t"+eval(partData));
                        ithFile_content = ithFile_contentArray.join("\n");
                        fs.writeFileSync("./Inventory_Files/INVENTORY"+i+".js", ithFile_content);*/
                        partDataAddedTo_fileNum = i;
                        //eval(MASTER_INVENTORY["INVENTORY"+partDataAddedTo_fileNum]).push(eval(partData));
                        //astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+i}, { $set: {data: eval("MASTER_INVENTORY.INVENTORY"+i)}}/*, {$inc:{v:1}}*/);          //DB
                        break findSpace;
                    }
                }

                //Make a new INVENTORY Fragment vv

                //var xthFile_contentArray = newINVENTORY_File_structure.split("\n");
                //var xthFile_content = xthFile_contentArray.join("\n");
                //fs.writeFileSync("./Inventory_Files/INVENTORY"+(n+1), xthFile_content);
                astrasystem.collection("INVENTORY_Files").insertOne({name: "INVENTORY"+(n+1), data:"[]"/*, version: 0*/} );          //DB
                n++;
                partDataAddedTo_fileNum = n;
                //update_FILECOUNTjs();
                //setUpPartMod("", n+1);
                MASTER_INVENTORY["INVENTORY"+partDataAddedTo_fileNum] = JSON.stringify([eval(partData)]);
                //MASTER_INVENTORY_vnums.push(0);
            }
            newFile = true;
        }
        /*astrasystem.collection("INVENTORY_Files").find().toArray((error, invFiles)=>{
            n = invFiles.length;
            //partDataAddedTo_fileNum = n;
            //console.log("Number of Inventory Files: " + n);
            nthFile_content = eval("MASTER_INVENTORY.INVENTORY"+(n)) //fs.readFileSync("./Inventory_Files/INVENTORY"+n).toString();
            if(firstTime) dataSafeBox = nthFile_content;
            //console.log("nthFile_content: "+ nthFile_content);
            //nthFile_contentArray = nthFile_content.split("\n");
            //console.log("nthFile_contentArray: "+ nthFile_contentArray);
            //partsIn_nthFile = nthFile_contentArray.length-4;
            //console.log("indexesIn_nthFile: "+ partsIn_nthFile);

            //if(!newFile) nthFile_contentArray[nthFile_contentArray.length-4] += ",";
            //nthFile_contentArray.splice(nthFile_contentArray.length-3, 0, "\t"+eval(partData));
            //console.log("Revised nthFile_contentArray: "+nthFile_contentArray);
            //nthFile_content = nthFile_contentArray.join("\n");
            //console.log("File data being loaded into INVENTORY"+n+".js:\n "+nthFile_content);
            //fs.writeFileSync("./Inventory_Files/INVENTORY"+n+".js", nthFile_content);

            eval("MASTER_INVENTORY.INVENTORY"+(n)) = eval("MASTER_INVENTORY.INVENTORY"+(n)).push(partData);
            astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+n}, {$set: {data: eval("MASTER_INVENTORY.INVENTORY"+n)}}/*, {$inc:{v:1}});    //DB
        //setUpPartMod("", n);

        /*try{
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

            console.log("Part data added to frag:  INVENTORY"+partDataAddedTo_fileNum);
            //MASTER_INVENTORY_vnums[partDataAddedTo_fileNum]++;
        });*/

        astrasystem.collection("INVENTORY_Files").updateOne({name: "INVENTORY"+partDataAddedTo_fileNum}, {$set: {data: eval("MASTER_INVENTORY.INVENTORY"+partDataAddedTo_fileNum)}}/*, {$inc:{v:1}}*/);    //DB

    });
}
//var newINVENTORY_File_structure = "var InventoryFragment = [   //  [partname_0, location_1, catagory_2, [tags_3, ...], quantity_4, imageURL_5, isBin?_6  (+ discription_7)]   //\n];\n\ndocument.querySelector(\"meta[name=InventoryDATA]\").setAttribute(\"content\", JSON.stringify(InventoryFragment));";