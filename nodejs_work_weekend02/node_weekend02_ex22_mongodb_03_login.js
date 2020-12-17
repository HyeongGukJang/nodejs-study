// 기본 모듈
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var static = require('serve-static');

// 세션, 쿠키, 로그인 관련 모듈
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 에러처리 관련 모듈
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');

// 라우팅 매핑을 위한 모듈
var router = express.Router();

app.set('port', process.env.PORT || 3000);


// 2. 로그인 처리를 위한 router 모듈과 body-parser 모듈
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// 1. /public 폴더를 static으로 지정
app.use('/public', static(path.join(__dirname, 'public')));


// 3. 쿠키와 세션 기본 설정
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


// 5. Express에서 몽고디비 사용-몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;
// 데이터베이스 객체를 위한 변수 선언
var db;
//데이터베이스에 연결 - createServer 생성 부분에서 바로 호출
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017';
	// 데이터베이스 연결
	MongoClient.connect(databaseUrl, function(err, database) {
		if (err) throw err;
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		// database 변수에 할당 할 때
		// 몽고디비3에서는 db명을 지정해 주어야 한다.(컬렉션 이름이 아님)
        db = database.db('local');
	});
}

// 6. 사용자가 보내온 아이디와 비밀번호 비교하기
var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.', id, '/', password);
    
    //컬렉션 참조
    var users = database.collection('users');
    
    /*users.find({}).toArray(function(err, docs) {
       console.log(docs.length); 
    });*/
    
    //아이디와 비밀번호를 사용해서 db 검색
    users.find({"id":id, "password":password}).toArray(function(err, docs) {
        console.log("docs.length => ", docs.length);
       if(err) {
           callback(err, null);
           return;
       }
        if(docs.length > 0) {
            console.log('아이디 [%s], 비밀번호 [%s]가 있다.', id, password);
            callback(null, docs);
        } else {
            console.log('사용자가 없다');
            callback(null, null);
        }
    });
}



// 4 router 기능을 이용해서 url 매핑
// 로그인 라우팅 함수 - 로그인 후 세션 저장함
// 7. 
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(db) {
        authUser(db, paramId, paramPassword, function(err, docs){
            if(err) { throw err; }
            
            if(docs) {
                console.dir(docs);
                var username = docs[0].name;
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<p>'+username+' / '+paramId+'</p>');
                res.write('<a href="/public/login2.html">다시 로그인 하기</a>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<a href="/public/login2.html">다시 로그인 하기</a>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터 베이스 연결 실패</h1>');
        res.end();
    }
    
    /*if(req.session.user) {
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
        res.write('<p>'+paramId+', '+paramPassword+'</p>')
        res.end();
    }*/
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
    
    // db 커넥션 실행
    connectDB()
});