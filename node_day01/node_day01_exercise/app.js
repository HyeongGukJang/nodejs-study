// node.js -> nodemon 불러오기 (cmd에서 명령어) -> npm start
// 
const http = require('http');
const express = require('express');
const { Router } = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set('port', 3000);
// ejs 뷰엔진 설정 - views:디렉토리, view engine: 확장자
app.set('views', __dirname +"/views"); // 디렉토리 경로
app.set('view engine', 'ejs'); // 확장자

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

var cars = [
    {name:"SM5", price:"3000", year:2015, company:"SAMSUNG"},
    {name:"K7", price:"5000", year:2019, company:"KIA"},
];

// router 안에서 rendering을 실행한다리!
router.route('/shop/ejs_test').get((req, res)=>{
    console.log('/shop/ejs_test 요청 들어옴!');

    // ejs파일 렌더링하기
    // ejs 파일이름. 전달객체, 콜백함수
    req.app.render('test',{"cars":cars},(err, html)=>{
        if(err){
            console.log(err);
            res.end("EJS Rendering Error!!!!");
            return;    
        }
        res.end(html);
    });
});



router.route('/shop/ejs_test').post((req, res)=>{
    // post에서 파라미터 사용 하려면, body-parser 미들웨어 설정 해야 한다.
    var data={
        "name":req.body.name,
        "price": parseInt(req.body.price),
        "year": parseInt(req.body.year),
        "company": req.body.company
    };

    // 리스트에 추가하기 -> 나중엔 디비로 바꿔
    cars.push(data);
    // 목록으로 리다이렉트
    res.redirect('/shop/ejs_test');
});


app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('>>>>>>>>>http://localhost:' + app.get('port'));
});