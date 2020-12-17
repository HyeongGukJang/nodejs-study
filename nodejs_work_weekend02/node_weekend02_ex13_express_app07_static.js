var express=require('express');
var http=require('http');
var path=require('path');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

//static 미들웨어로 public 폴더 지정
app.use('/public', static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
});