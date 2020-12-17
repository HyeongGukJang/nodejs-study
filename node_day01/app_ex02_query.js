const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');
// 라우터 미들웨어 설정은 맨 아래쪽에서 한다.
const router = express.Router();

app.set('port', 3000);

// 외부 모듈을 미들웨어로 사용
app.use('/html', static(__dirname + "/public"));

// 사용자 정의 미들웨어(요청 결과를 보여주기전에 사전 처리 하는 부분) 
// 미들웨어 설정 부분
app.use(function(req, res, next) {
    next();
});

router.route('/').get(function(req, res) {
    // 경로가 localhost:3000/으로 접속하면 /html/index.html로 갱신
    res.redirect('/html/');
});

router.route('/home').get(function(req, res) {
    // 요청 파라미터 받아오기
    // GET 요청 방식은 req.query의 속성으로 받아온다.
    let user = req.query.user;
    let passwd = req.query.passwd;
    res.writeHead(200, {"Content-Type":"text/html;charset=UTF-8"});
    res.write(`<h1>USER:${user}, PASSWORD:${passwd}</h1>`);
    res.end();
});

// path 설정이 모두 끝나고 라우터 미들웨어 등록한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Run on server >> http://localhost:%d', app.get('port'));
});