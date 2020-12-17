// 쿼리스트링으로 전달된 파라미터 확인
// req.query.name 

var http = require('http');
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청 처리 함.');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>User-Agent: '+ userAgent +'</p></div>');
    res.write('<div><p>Param name: '+ paramName +'</p></div>');
    res.end();
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
   console.log('서버가 시작 되었습니다. %d', app.get('port'));
});