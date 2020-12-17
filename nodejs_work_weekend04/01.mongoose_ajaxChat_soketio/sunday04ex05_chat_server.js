// sunday04ex04_counter.js
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());

// 자바스크립트의 배열 초기화 권장 방식.
var messages = [];

router.route('/recieve').get((req, res) => {
    if(messages.length <= req.query.size) {
       res.end();
    } else {
       // 변경된 내용을 클라이언트로 전달.
        var result = {
            total : messages.length,
            messages : messages.slice(req.query.size)
        }
        res.end(JSON.stringify(result));
    }
});

router.route("/send").get((req, res)=>{
    // 배열에 서버로 전달된 메세지 추가
    messages.push({
        sender : req.query.sender,
        message: req.query.message
    });
    res.end();
});

app.use('/', router);
const server = http.createServer(app);
server.listen(3000, ()=>{
    console.log('http://localhost:3000');
});