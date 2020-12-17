const MongoClient = require('mongodb').MongoClient;

let dbUrl = "mongodb://localhost";
MongoClient.connect(dbUrl, function(err, client){
    if(err) throw err;

    let db = client.db("vehicel");
    db.collection("car").findOne({}, function(findErr, document){
        if(findErr) {
            throw findErr;
        }
        console.log(document.name);
        client.close();
    });
});