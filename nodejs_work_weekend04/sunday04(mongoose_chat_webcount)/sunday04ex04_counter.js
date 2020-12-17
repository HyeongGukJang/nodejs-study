// sunday04ex04_counter.js
var http = require('http');
var express = require('express');
// npm install cors --save
var cors = require('cors');
var app = express();
var router = express.Router();

app.set('port', 3000);
app.use(cors());


var cnt = 0;
router.route('/count').get(function(req, res) {
    cnt++;
    var response = {
        "count":cnt
    }
    
    res.end(JSON.stringify(response));
});


app.use('/', router);
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
});