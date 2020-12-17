// send()메소드를 이용해서 JSON 객체 전달.

var http = require('http');
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청을 처리함.');
    
    res.send({name:'방탄소년단', age:25});
});
 
var server = http.createServer(app);
server.listen(app.get('port'), function() {
   console.log('웹 서버가 시작 되었습니다. %d', app.get('port')); 
});