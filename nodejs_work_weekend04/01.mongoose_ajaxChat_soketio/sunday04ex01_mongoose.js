const http = require('http');
const express = require('express');
const app = express();

const path = require('path');
const static = require('serve-static');
const router = express.Router();

const mongoose = require('mongoose');


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', static(path.join(__dirname, 'public')));


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
}

app.use('/', router);

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
    connectDB();
});