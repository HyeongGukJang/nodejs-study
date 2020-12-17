// 미들웨어 순차적 실행
// 여러개의 미들웨어에서 응답 처리 하기

var http = require('http');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청 처리함');
    
    //res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    //res.end("<h1>Express 서버에서 응답한 결과입니다.</h1>");
    
    req.user = 'mike';
    
    next();
});

app.use('/', function(req, res, next) {
    console.log('두번째 미들웨어에서 요청을 처리함.');
    
    res.writeHead('200', {'Content-Type':"text/html;charset=utf8"});
    res.end('<h1>Express 서버에서 ' + req.user + '가 응답한 결과입니다.</h1>');
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
   console.log("서버가 실행 되었습니다. %d", app.get('port')); 
});