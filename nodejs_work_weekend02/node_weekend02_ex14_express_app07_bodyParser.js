var express=require('express');
var http=require('http');
var path=require('path');

var bodyParser=require('body-parser');
var static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

//body-parser를 사용해서 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

//body-parser를 사용해서 application/json 파싱
app.use(bodyParser.json());

//static 미들웨어로 public 폴더 지정
app.use('/public', static(path.join(__dirname, 'public')));

//미들웨어에서 파라미터 확인
app.use(function(req, res, next) {
    console.log('첫번째 미들웨어에서 요청을 처리함.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express서버 응답 결과</h1>');
    res.write('<div><p>Param id : '+ paramId +'</p></div>');
    res.write('<div><p>Param password : '+ paramPassword +'</p></div>');
    res.end();
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
})