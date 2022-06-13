const fs = require("fs");
const path = require('path');


var account = "Ian_Alexander";
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@astradata.3dnfp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var astrasystem = ""; 
client.connect((res,err)=>{
    console.log("~Database Connection Established~");
    astrasystem = client.db(account);
    
    var filesCollection = astrasystem.collection("INVENTORY_Files");
    var imagesCollection = astrasystem.collection("INVENTORY_Images");
    
    filesCollection.deleteMany({});
    
    var n = 1;
    while(n <=18){
        var fileName = "INVENTORY"+n+".js";
        var nthFile_content = fs.readFileSync("./Inventory_Files/"+fileName).toString();
        
        filesCollection.insertOne({name: fileName, data: nthFile_content});
        
        n++;
    }
});







/*
//Do something to everybody...
    collection.find().toArray((error, data)=>{
        data.forEach((user)=>{
            console.log(user.username+"\n");
        });
    });

//Do something to one person...
    collection.findOne({username: "Ian_Alexander"},(error, data)=>{
            collection.updateOne({username: data.username},{$set:{superpowers:true}});
            console.log("Setting user "+data.username+"'s superpowers on" );
    });   
*/

