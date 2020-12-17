const MongoClient = require('mongodb').MongoClient;
const _ = require("underscore");

let dbUrl = "mongodb://localhost";
MongoClient.connect(dbUrl, function(err, client){
    if(err) throw err;

    let db = client.db("vehicel");
    db.collection("car").find({"price":{"$gte":2000}}).toArray(function(findErr, arr){
        if(findErr) throw findErr;
        var list = _.sortBy(arr, function(doc){
            return doc;

        });
        console.log(list);
        client.close();
    });
});