// sunday03ex06_adduser.js
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();
var static = require('serve-static');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoClient = require('mongodb').MongoClient;

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

var db;

function connectDB() {
    var dbURL = "mongodb://localhost:27017";
    MongoClient.connect(dbURL, function (err, conn) {
        if (err) throw err;

        db = conn.db('local');
        console.log('DB접속 성공 : ', dbURL);
    });
}

function authUser(db, loginData, callback) {
    console.log('authUser >>> ', loginData);

    var users = db.collection('users');

    // 중복된 아이디가 없다는 가정하에 findOne 사용
    users.find(loginData).toArray(function (err, docs) {
        if (err) {
            callback(err, null);
            return;
        }
        //console.log("docs >>> ", docs);
        if (docs.length > 0) {
            console.log('사용자 정보 %s가 있다.', docs[0].name);
            callback(null, docs);
        } else {
            console.log('사용자 정보 없다!')
            callback(null, null);
        }
    });
} // end of authUser

function addUser(db, userData, callback) {
    console.log('addUser 함수 호출 ...', userData);
    
    // db에 userData입력...
    // insertMany함수 사용
    var users = db.collection('users');
    
    users.insertMany([userData], function(err, result) {
        if(err) {
            callback(err, null);
            return;
        }
        
        if(result.insertedCount > 0) {
            console.log('사용자 추가 성공!', result.insertedCount);
        } else {
            console.log('추가된 사용자 정보가 없다!');
        }
        
        callback(null, result);
    });
}

// /process/login 패스 처리
router.route('/process/login').post(function (req, res) {
    console.log('POST - /process/login');

    var loginData = {
        id: req.body.id,
        password: req.body.password
    }

    if (db) {
        authUser(db, loginData, function (err, docs) {
            if (err) throw err;

            if (docs) {
                console.log(docs);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1>로그인 성공!</h1>');
                res.write('<a href="/process/logout">로그아웃</a>');
                res.end();
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h1>로그인 실패!</h1>');
                res.write('<a href="/public/login.html">다시 로그인</a>');
                res.end();
            }
        });
    }
    // res.end(); 한번만 실행하도록 한다.
    //res.end();
});

router.route('/process/logout').get(function (req, res) {
    console.log('/process/logout');

    // 로그아웃 처리 로직 추가 할 부분....
    res.redirect('/public/login.html');
});

// 몽고DB에 사용자 추가 기능 구현
// id, name, password를 전달 받도록 한다.
router.route('/process/adduser').post(function (req, res) {
    console.log('/process/adduser 호출 ...');
    
    var userData = {
        id : req.body.id,
        name : req.body.name,
        password : req.body.password
    }
    //console.log('userData >>> ', userData);
    
    if(db) {
        addUser(db, userData, function(err, result) {
            if(result.insertedCount > 0) {
                //res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                //res.end('사용자 정보 입력 성공!');
                res.redirect('/user_list');
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.end('사용자 정보 입력 실패!');
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.end('db 정보가 없다!');
    }
    // end()가 중복되지 않도록 주의할것. 
});

// 라우팅 패스 핸들러
router.route('/user_list').get(function(req, res) {
    console.log('/user_list');
    
    if(db) {
        var users = db.collection('users');
        users.find().toArray(function(err, docs) {
            //console.log(docs);
            //res.end();
            req.app.render('user_list', {userList: docs}, function(err2, html) {
                if(err2) {
                    console.log(">>>>>>>>>>> 렌더링 에러 발생", err2);
                    throw err2;
                }
                
                res.end(html);
            });
        });
    } else {
        console.log('db 연결 정보가 없다!');
        res.end('no db!');
    }
});

app.use(router);
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('http://localhost:%d', app.get('port'));
    connectDB();
});
