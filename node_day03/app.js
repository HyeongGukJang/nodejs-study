const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');
const router = express.Router();
const path = require('path'); // OS마다 다른 구분자를 
const bodyParser = require('body-parser');
const { getMaxListeners } = require('process');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let db;
function connectDB() {
    let dbUrl = "mongodb://localhost";
    MongoClient.connect(dbUrl, {useUnifiedTopology: true}, function(err, client){
        if(err) throw err;
        db = client.db("lecture");
        console.log(">>> ", dbUrl);
    });
}

/*
mongo

use lecture

db.register.save({"name":"HONG", "phone":"010-1111-1111", "subject":"JAVA", "studyday":"2020-11-15"});
db.register.save({"name":"PARK", "phone":"010-2222-2222", "subject":"ORACLE", "studyday":"2020-11-20"});
db.register.save({"name":"LEE", "phone":"010-3333-3333", "subject":"SPRING", "studyday":"2020-11-25"});
db.register.save({"name":"KANG", "phone":"010-4444-4444", "subject":"Vue.js", "studyday":"2020-11-30"});
*/

let dataList = [
    {"no":1, "name":"HONG", "phone":"010-1111-1111", "subject":"JAVA", "studyday":"2020-11-15"},
    {"no":2, "name":"PARK", "phone":"010-2222-2222", "subject":"ORACLE", "studyday":"2020-11-20"},
    {"no":3, "name":"LEE", "phone":"010-3333-3333", "subject":"SPRING", "studyday":"2020-11-25"}
];
let no = 4;

Array.prototype.myFindIndex = function(key, value) {
    for(var i=0; i<this.length; i++) {
        if(this[i][key] == value) {
            return i;
        }
    }
    return -1;
}

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/html', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/').get((req, res)=>{
    res.redirect('/html');
});

function insertData(db, data, callback) {
    let register = db.collection('register');
    register.insertMany([data], function(err, result) {
        callback(err, result);
    });
}

router.route('/register/input').post((req, res)=>{
    let data = {
        "name" : req.body.name,
        "phone" : req.body.phone,
        "subject" : req.body.subject,
        "studyday" : req.body.studyday
    }
    if(db) {
        insertData(db, data, function(err, result) {
            if(err) {
                console.log("데이터 입력 오류!");
                throw err;
            }
            if(result.insertedCount>0) {
                console.log(">>> 등록 성공!!");
            } else {
                console.log(">>> 데이터 입력이 없습니다!");
            }
            res.redirect('/register/list');
        });
    } else {
        res.end("<h2>Errr! : No DB</h2>");
    }
    
});
//----------------------------------------------------------------------------------

function getList(db, callback) {
    // collection 찾기 -> find().toArray()
    let lecture = db.collection("register");
    lecture.find({}).toArray(function(findErr, arr){
        if(findErr)  {
            callback(findErr, null);
            return;
        }
        // arr에 있는 객체 no 필드 추가하기
        let newArr = [];
        for(var i in arr) {
            let data = arr[i];
            data.no = data._id;
            newArr.push(data);
        }
        dataList = newArr;
        callback(findErr, newArr);
    });
}

router.route('/register/list').get((req, res)=>{
    // db에서 array를 가져오는 부분.
    if(db) {
        getList(db, function(findErr, arr){
            //DB에서 목록을 가져 온 후에 실행된다.
            if(findErr) throw findErr;
            // 뷰엔진 ejs 사용
            req.app.render('register_list', {"list":arr}, (err, html)=>{
                if(err) {
                    res.end('<h2>EJS Rendering Error!</h2>');
                    return;
                }
                res.end(html);
            });
        });
    }
});

//----------------------------------------------------------------------------------
router.route('/register/detail/:no').get((req, res)=>{
    let no = req.params.no;
    let idx = dataList.myFindIndex("no", no);
   
    req.app.render('register_detail', {"data":dataList[idx]}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
});

router.route('/register/modify/:no').get((req, res)=>{
    let no = req.params.no;
    let idx = dataList.myFindIndex("no", no);

    req.app.render('register_modify', {"data":dataList[idx]}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
});

router.route('/register/modify').post((req, res)=>{
    let id = req.body.no;
    let data = {
        "name" : req.body.name,
        "phone" : req.body.phone,
        "subject" : req.body.subject,
        "studyday" : req.body.studyday
    }
    if(db) {
        let register = db.collection('register');
        register.updateMany({"_id": new ObjectID(id)}, {$set: data},function(err, result) {
            if(err) {
                console.log(">>> 수정 에러 발생!");
                return;
            }
            
            if(result.modifiedCount>0) {
                console.log("데이터 수정 성공!");
            } else {
                console.log("수정 실패!");
            }
            // 수정 완료 후 목록으로 이동
            res.redirect('/register/list');
        });

    } else {
        res.end("db modify error!")
    }
    
});

router.route('/register/delete/:no').get((req, res)=>{
    let no = parseInt(req.params.no);
    let idx = dataList.myFindIndex("no", no);
    
    console.log(idx);
    dataList.splice(idx, 1);
    res.redirect('/register/list');
});

app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('http://localhost:%d', app.get('port'));
    connectDB(); // 서버 실행 후 몽고디비 connect하는 함수 호출한다.
});