console.log("~Manual Control Starterd~\n\n");

const fs = require("fs");
const path = require('path');
const imageToUri = require('image-to-uri')
const imageDataURI = require('image-data-uri')
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
function connectionTreshold(){
    if(connections == totalConnections){
        perform();
    }
}
function closeProgram(){
    console.log("Program Complete");
    process.exit(0);
}
connectToDBs();
////////SETUP COMPLETE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function perform(){
    console.log("\nInitiating perform()...\n");
    astrasystem.collection("INVENTORY_Files").find().toArray((error, data)=>{
        data.forEach((fileCont)=>{
            console.log("old name: "+fileCont.name);
            var newName = fileCont.name.substring(0,fileCont.name.indexOf("."));
            console.log("new name: "+newName);
            
            astrasystem.collection("INVENTORY_Files").updateOne({name: fileCont.name},{$set:{name:newName}});
            
            //console.log(JSON.stringify(user.data).split("\n")+"\n");
        });
    });
}

































