// sunday04ex02_mongoose.js
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();
var static = require('serve-static');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

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

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var dbUrl = "mongodb://localhost:27017/local";
    
    console.log('데이터 베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function() {
        console.log('데이터베이스에 연결되었습니다. : %s', dbUrl);
        // 스키마와 모델을 준비 한다.
        UserSchema = mongoose.Schema({
            id : String,
            name : String,
            password : String
        });
        //console.log('UserSchema 정의함 >>> ', UserSchema);
        // users 컬렉션(테이블)에 위에 정의한 스키마를 설정한다.
        UserModel = mongoose.model('users', UserSchema);
        //console.log('UserModel 정의함 >>> ', UserModel);
    });
    
    database.on('disconnected', function() {
        console.log('연결이 끊겼습니다. 5초 후 다시 연결 시도!');
        setTimeout(connectDB, 5000);
    });
}

function addUser(database, userData, callback) {
    console.log('addUser 함수 호출 >>> ', userData);
    
    var user = new UserModel(userData);
    
    user.save(function(err) {
        if(err) {
            callback(err, null);
            return;
        } 
        console.log('사용자 정보 입력 성공!');
        callback(null, user);
    });
} // end of addUser

router.route('/process/adduser').post(function(req, res) {
    console.log('/process/adduser 요청 받음 ...');
    
    var paramId = req.body.id;
    var paramPwd = req.body.password;
    var paramName = req.body.name;
    var userData = {
        id : paramId,
        name : paramName,
        password : paramPwd
    };
    
    if(database) {
        addUser(database, userData, function(err, user) {
            if(err) {
                res.end('user insert error!', err);
                return;
            }
            res.end('user insert success!');
        });
    } else {
        res.end('db connect error!');
    }
});

app.use('/', router);
var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
    
    connectDB();
});