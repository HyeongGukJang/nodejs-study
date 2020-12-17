// counter_server.js
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors');

//크로스 도메인 문제 해결 - cors()
app.use(cors());

// 카운터 기능
var cnt = 0;
router.route('/count').get(function(req, res) {
    cnt++;
    var date = new Date();
    var response = {
        "dateStr" : date.getFullYear() + "-" +
            (date.getMonth()+1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes()
        , "count" : cnt
    }
    res.end(JSON.stringify(response));
});

router.route('/chk_cnt').get(function(req, res) {
    // localhost:3000/chk_cnt?size=17
    var size = Number(req.query.size);
    if(cnt <= size) {
        res.end("");
    } else {
        var date = new Date();
        var response = {
            "dateStr" : date.getFullYear() + "-" +
                (date.getMonth()+1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + date.getMinutes()
            , "count" : cnt
        }
        res.end(JSON.stringify(response));
    }
});

app.use('/', router);
var server = http.createServer(app);
server.listen(3000, function() {
    console.log('http://localhost:3000 ...');
});