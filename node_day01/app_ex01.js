const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');

app.set('port', 3000);

// 외부 모듈을 미들웨어로 사용
app.use('/html', static(__dirname + "/public"));

// 사용자 정의 미들웨어(요청 결과를 보여주기전에 사전 처리 하는 부분) 
// 미들웨어 설정 부분
app.use(function(req, res, next) {
    next();
});

app.get('/', function(req, res) {
    // 경로가 localhost:3000/으로 접속하면 /html/index.html로 갱신
    res.redirect('/html/');
});

app.get('/home', function(req, res) {
    res.writeHead(200, {"Content-Type":"text/html;charset=UTF-8"});
    res.write("<h1>Welcome to my homepage!</h1>");
    res.write("<h2>오신것을 환영합니다!</h2>");
    res.write('<img src="/html/images/banner.jpg">')
    res.end();
});

const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Run on server >> http://localhost:%d', app.get('port'));
});