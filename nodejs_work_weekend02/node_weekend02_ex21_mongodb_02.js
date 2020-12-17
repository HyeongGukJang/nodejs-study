/*

// Express에서 몽고디비 사용-몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;
// 데이터베이스 객체를 위한 변수 선언
var db;
//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017';
	// 데이터베이스 연결
	MongoClient.connect(databaseUrl, function(err, database) {
		if (err) throw err;
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		// database 변수에 할당할때
		// 몽고디비3에서는 db명을 지정해 주어야 한다.
        db = database.db('vehicle');
	});
}

// collection 비교 function
var authUser = function(database, callback) {
    var car = database.collection('car');   
    car.find({"name": "BMW"}).toArray(function(err, docs){
        console.log(docs);
    });
}

// 선언한 함수 호출 - 나중에 라우팅 함수에 적용 한다.
connectDB();
setTimeout(function(){
    if(db) {
        authUser(db, function(err, docs) {
            if(err) throw err;
        });
    }
},2000);

*/


var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost', function (err, client) { 
    if (err) throw err; 
    var db = client.db('vehicle'); 
    db.collection('car').findOne({}, function (findErr, result) { 
        if (findErr) throw findErr; 
        console.log(result.name); 
        client.close(); 
    }); 
});
