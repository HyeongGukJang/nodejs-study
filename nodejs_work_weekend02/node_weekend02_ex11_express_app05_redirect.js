// redirect() 함수를 이용한 다른 페이지 갱신

var http = require('http');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청 처리 함.');
    
    res.redirect('http://google.co.kr');
});


var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
});