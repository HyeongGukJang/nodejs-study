const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
app.set('port',3000);

let db;
function connectDB(){
    let dbUrl = "mongodb://localhost";
    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, function(err, client){
    if(err) throw err;
    db = client.db("vehicel");    
    console.log(">>>", dbUrl);
    });
}

app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'),()=>{
    console.log("http://localhost:%d", app.get('port'));
    connectDB();
});