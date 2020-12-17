const http = require('http');
const express = require('express');
const app = express();

const path = require('path');
const static = require('serve-static');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const router = express.Router();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', static(path.join(__dirname, 'public')));

// 쿠키와 세션 미들웨어 등록 - cookieParser() 괄호 붙일것!!!
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

// 요청 파라미터 처리를 위한 body-parser 미들웨어 등록
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 데이터베이스, 스키마, 모델을 저장하는 전역변수 선언.
// 호이스팅(끌어올림) 주의.
// 이벤트 핸들러 안에서 this는 다른 의미이다.
// 비동기 처리(setTimeout, setInterval, Ajax) 주의.
var database; //database connection 정보
var UserSchema;
var UserModel;

const connectDB = ()=>{
    var dbUrl = 'mongodb://localhost:27017/local';
    
    console.log('데이터베이스 연결 시도!');
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    database = mongoose.connection;
    
    database.on('error', 
               console.error.bind(console, 'mongoose connection error!'));
    database.on('open', ()=>{
        console.log(`데이터베이스에 연결되었습니다. : ${dbUrl}`);
        
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        //console.log('UserSchema 정의함: ', UserSchema);
        
        UserModel = mongoose.model('users', UserSchema);
        //console.log('UserModel 정의함: ', UserModel);
    });
    
    //연결이 끊어졌을때 5초후 재 연결
    database.on('disconnected', ()=>{
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setTimeout(connectDB, 5000);
    });
} // end of connectDB

// 사용자를 인증하는 함수 : authUser
const authUser = (database, id, password, callback)=>{
    console.log(`authUser() 함수 호출 : ${id}, ${password}`);
    
    //UserModel을 이용해서 db데이터 검색
    UserModel.find({id:id, password:password}, function(err, results) {
        if(err) {
            callback(err, null);
            return;
        }
        
        // 검색 성공
        //console.log(results);
        if(results.length > 0) {
            console.log('사용자 정보 찾기 성공:', results[0].id, results[0].password);
            callback(null, results);
        } else {
            console.log('사용자 정보를 찾을 수 없습니다!');
            callback(null, null);
        }
        
    }); // end of find
} // end of authUser

// 로그인 처리 라우팅 함수 선언
router.route('/process/login').post((req, res)=>{
    console.log('/process/login 요청 됨...');
    
    var paramId = req.body.id;
    var paramPwd = req.body.password;
    
    console.log(paramId, ' : ', paramPwd);
    
    if(database) {
       authUser(database, paramId, paramPwd, (err, docs)=>{
           if(err) throw err;
           
           //console.log(docs);
           if(docs) {
               console.log('로그인 성공!');
               req.session.user = {
                   id: docs[0].id,
                   name: docs[0].name
               }
               req.app.render('login_result', {'user': req.session.user}, (err, html)=>{
                   if(err) throw err;
                   res.end(html);
               });
           } else {
               console.log('로그인 실패!');
               res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
               res.write('<h2>로그인 실패: 일치하는 로그인 정보가 없다!</h2>');
               res.end();
           }
       });
    } else {
        console.log('db 접속 안됨!!');
        res.end('MongoDB database connection error!');
    }
});

// router 설정
app.use('/', router);

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
    connectDB();
});