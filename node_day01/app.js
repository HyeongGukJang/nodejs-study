const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');
// 라우터 미들웨어 설정은 맨 아래쪽에서 한다.
const router = express.Router();
const bodyParser = require('body-parser');

app.set('port', 3000);
// 뷰엔진을 ejs로 사용하고 디렉토리는  /views로 설정
app.set('views', __dirname+"/views"); //뷰 파일 디렉토리
app.set('view engine', "ejs"); //파일 확장자

// 외부 모듈을 미들웨어로 사용
app.use('/html', static(__dirname + "/public"));
// POST 방식의 요청파라미터 처리를 위한 미들웨어 설정.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

// 사용자 정의 미들웨어(요청 결과를 보여주기전에 사전 처리 하는 부분) 
// 미들웨어 설정 부분
app.use(function(req, res, next) {
    next();
});

// 데이터를 저장 하는 부분.
var carList = [
    {"no":1, "name":"SONATA", "price":2500, "company":"현대", "year":2018},
    {"no":2, "name":"S90", "price":2500,"company":"볼보", "year":2020},
    {"no":3, "name":"K5", "price":2500,"company":"기아", "year":2018},
    {"no":4, "name":"SM6", "price":3200,"company":"삼성", "year":2017},
    {"no":5, "name":"GRANDEUR", "price":3500,"company":"현대", "year":2016}
];
var seq = 6; // 시퀀스 대용.

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

router.route('/process/message').post(function(req, res) {
    // 요청 파라미터 받아오기
    // POST 방식의 요청 파라미터는 body-parser미들웨어를 이용한다.
    let user = req.body.user;
    let msg = req.body.msg;
    res.writeHead(200, {"Content-Type":"text/html;charset=UTF-8"});
    res.write("<h1>메세지 확인</h1>");
    res.write(`<p>${user} : ${msg}</p>`);
    res.end();
});

router.route('/shop/car_input').post(function(req, res) {
    // 요청 파라미터 받아오기
    // POST 방식의 요청 파라미터는 body-parser미들웨어를 이용한다.
    //let carData = JSON.parse(JSON.stringify(req.body).trim() );

    let carObj = {
        "no": seq++,
        "name": req.body.name,
        "price": parseInt(req.body.price),
        "company": req.body.company,
        "year": parseInt(req.body.year)
    };

    // 데이터 저장 후 목록으로 리다이렉트 된다.(돌아간다).
    carList.push(carObj);
    res.redirect('/shop/car_list');
});

router.route('/main').get((req, res) => {
    // views에 경로, view engine에 확장자 설정 했기 때문에 파일명만 사용.
    req.app.render('main', {name:'HONG'}, function(err, html) {
        if(err) {
            res.end("<h2>Error!</h2>");
            return;
        }
        res.end(html);
    });
});

// 자동차 목록을 보여주는 기능.
router.route('/shop/car_list').get(function(req, res) {
    req.app.render('car_list', {"carList":carList}, function(err, html) {
        if(err) {
            console.log(err);
            res.end("<h2>Error!</h2>");
            return;
        }
        res.end(html);
    });
});

// path 설정이 모두 끝나고 라우터 미들웨어 등록한다.
app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('Run on server >> http://localhost:%d', app.get('port'));
});