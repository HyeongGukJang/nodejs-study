// chat_server.js
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors');

//크로스 도메인 문제 해결 - cors()
app.use(cors());

// 전역변수 : 메세지 저장
var messages = []; // 메세지를 저장하는 배열
router.route('/recieve').get(function(req, res) {
    var size = Number(req.query.size);
    //console.log("size => " + size);
    if(size >= messages.length) {
        res.end();
        return;
    }
    // 추가된 메시지가 있다면 잘라서 전송.
    var respData = {
        total : messages.length,
        messages : messages.slice(size)
    }
    res.end(JSON.stringify(respData));
});

router.route('/send').get(function(req, res) {
    messages.push({
        sender: req.query.sender,
        message: req.query.message
    });
    res.end();
});

app.use('/', router);
var server = http.createServer(app);
server.listen(3000, function() {
    console.log('http://localhost:3000 ...');
});