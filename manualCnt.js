const fs = require("fs");
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Napoleon1234:socialEntreprenuer78@astradata.3dnfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const saltRounds = 5;
const bcrypt = require('bcrypt');
const path = require('path');


var collection = null;
client.connect(err => {
    collection = client.db("Astradata").collection("astracore");



    /*
    //Initialize files object
    var fileObject = {};
    //put stringified versions of each INVENTORY file's contents into the object with the file's name as the key
    const directoryPath = path.join(__dirname, 'Documents');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            console.log(file);
            //fileObject+""+file = fs.readFileSync(directoryPath+"/"+file);
        });
    });
    //Finish up by 
    */

    collection.updateOne(
        {doc:"MasterData"},
        //{$set: { master_Cat: [] }}
        { $push: { master_Cat: {testField: "testValue! Yay!!"} } }
    ).then(()=>{
        console.log("Data should be changed");
        collection.find({doc:"MasterData"}).toArray((error, data)=>{
            data.forEach((user)=>{
                console.log(JSON.stringify(user));
            });
        });
    });





    setTimeout(()=>{
        console.log("Closing mongoDB session");
        client.close();
    },2000);
}); 




/*
var picURI = null;
function convertToURI(imgToConvert){
    const reader = new FileReader();

    reader.addEventListener("load", ()=>{
        picURI = reader.result;
        console.log("~URI TRANSLATION COMPLETE!...");
        console.log(picURI);
    });

    reader.readAsDataURL(imgToConvert);
}


convertToURI("./Inventory_Images/2021-8-14_18_0_30_874.png");
*/















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


/*  Function for encrypting everyone's password...
    collection.find({password:{$exists: true}}).toArray((error, data)=>{
        data.forEach((user)=>{
            console.log("Encrypting user "+user.username+"'s password...\n");
            console.log("User's old password: "+user.password+"\n");
            bcrypt.genSalt(saltRounds, function(err, salt) {
                console.log("salt:" +salt);
                bcrypt.hash(user.password, salt, function(err, hash) {
                    console.log("hash:"+ hash);
                    user.password = hash;
                });
            });
            console.log("User's new password: "+user.password+"\n");
        });

    });
*/

/*  Funtion for creating user data transfere file...*/
function generateUserFile(){
    var allUserDataObject = {"allUserData":[]};
    let myPromise = new Promise((resolve,reject)=>{
        collection.find().toArray((error, data)=>{
            data.forEach((user)=>{
                console.log("Adding user "+user.username+"'s account information to the allUserData Object\n");
                allUserDataObject.allUserData.push(
                    {"username": user.username, password: user.password, token: user.token, portalMode: user.portalMode, colors: user.colors, superpowers: user.superpowers, totalLogins: user.totalLogins}
                );
            });
            resolve();
        });
    });
    myPromise.then(()=>{
        console.log("Done building user string: "+ JSON.stringify(allUserDataObject));
        fs.writeFileSync("./user_data/ALLUSERDATA_transfereFile.json", JSON.stringify(allUserDataObject));
    });
}
function upgradeDate(oldDate){
    if(oldDate == undefined){
        return;
    }

    if(oldDate.indexOf("am") != -1 && oldDate.indexOf("pm") != -1){
        return oldDate;
    }

    var dateArr = oldDate.replace(/[^0-9]/g, ' ').split(" ");

    var year = dateArr[0];
    var month = strAdjust(dateArr[1]);
    var day = strAdjust(dateArr[2]);
    var hour = strAdjust(dateArr[3]);
    var minuete = strAdjust(dateArr[4]);
    var second = strAdjust(dateArr[5]);
    var millisecond = dateArr[6];

    if(hour <= 12){
        hour = hour+"am";
    }else{
        hour = (hour-12)+"pm";
    }

    return year+"-"+month+"-"+day+"___"+hour+":"+minuete+":"+second+"."+millisecond;
}

function strAdjust(n){
    return (n<10)?"-"+n:n;
}

function unNanify(old){
    if(old == undefined){
        return old;
    }
    return old.replace(/NaN/g, '0');
}
