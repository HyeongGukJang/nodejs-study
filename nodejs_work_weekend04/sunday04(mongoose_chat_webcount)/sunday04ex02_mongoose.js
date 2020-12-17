// sunday04ex02_mongoose.js
var http = require('http');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

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

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('http://localhost:%d', app.get('port'));
    
    connectDB();
});