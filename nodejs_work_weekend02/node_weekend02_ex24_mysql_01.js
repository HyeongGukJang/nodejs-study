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


// 2. 요청 파라미터 처리를 위한 body-parser 모듈
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


//// MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기
var mysql = require('mysql');

//// MySQL 데이터 베이스 연결 설정
var pool = mysql.createPool({
    connectionLinit : 10,
    host : 'localhost',
    user : 'root',
    password : '12345',
    database : 'test',
    debug : false
});



// 사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req, res) {
	console.log('/process/adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge);
    
    // pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (pool) {
		addUser(paramId, paramName, paramAge, paramPassword, function(err, addedUser) {
			// 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
            // 결과 객체 있으면 성공 응답 전송
			if (addedUser) {
				console.dir(addedUser);
				console.log('inserted ' + addedUser.affectedRows + ' rows');
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공</h2>');
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가  실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
});



//사용자를 등록하는 함수
var addUser = function(id, name, age, password, callback) {
	console.log('addUser 호출됨:'+id+','+password+','+name+','+age);
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
    	// 데이터를 객체로 만듦
    	var data = {id:id, name:name, age:age, password:password};
        // SQL 문을 실행함
        var exec = conn.query('insert into users set ?',data,function(err, result) {
        	conn.release();  // 반드시 해제해야 함
        	console.log('실행 대상 SQL : ' + exec.sql);
        	if (err) {
        		console.log('SQL 실행 시 에러 발생함.');
        		callback(err, null);
        		return;
        	}
        	callback(null, result);
        });
        conn.on('error', function(err) {      
              console.log('데이터베이스 연결 시 에러 발생함.'); 
              callback(err, null);
        });
    });
}




app.use('/', router);



var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
    
});