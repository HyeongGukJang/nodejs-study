// sunday04ex04_counter.js
var http = require('http');
var express = require('express');
// npm install cors --save
var cors = require('cors');
var app = express();
var router = express.Router();

app.set('port', 3000);
app.use(cors());


var messages = [];

router.route('/recieve').get(function(req, res) {
    var size = Number(req.query.size);
    
    if(size < messages.length) {
        var response = {
            total: messages.length,
            messages : messages.slice(size)
        }
        console.log(response);
        res.end(JSON.stringify(response));
    } else {
        res.end();
    }
});

router.route('/send').get(function(req, res) {
    messages.push({
        sender : req.query.sender,
        message : req.query.message
    });
    res.end();
});


app.use('/', router);
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});