var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

var router = express.Router();
// 상품정보 라우팅
router.route('/process/product').get(function(req, res) {
    console.log('/process/product 호출.');
    
    if(req.session.user === undefined){
        res.redirect('/public/login2.html');
    } else {
        res.redirect('/public/product.html');
    }
});

// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(req.session.user) {
        console.log('이미 로그인 되어 상품 페이지로 이동 함.');
        res.redirect('/public/product.html');
    } else {
        // 세션 저장
        req.session.user = {
            id:paramId,
            name:'소녀시대',
            authorized: true
        };
        
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>Param ID : '+ paramId +'</p></div>');
        res.write('<div><p>Param Password : '+ paramPassword +'</p></div>');
        res.write("<br><br><a href='/process/product'>상품 페이지</a>");
        res.end();
    }
});

// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout 호출됨.');
    if(req.session.user){
        //로그인 된 상태
        console.log('로그아웃 합니다.');
        req.session.destroy(function(err) {
            if(err) { throw err;}
            console.log('세션을 삭제하고 로그아웃 되었습니다.');
            res.redirect('/public/login2.html');
        });
    }else{
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.')
        res.redirect('/public/login2.html');
    }
});


app.use('/', router);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
})