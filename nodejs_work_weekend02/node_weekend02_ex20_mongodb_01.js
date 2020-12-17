// Node.js에서 MongoDB 사용하기

var mongojs = require('mongojs');
var db = mongojs('vehicle',['car']);
db.car.find(function(err, data) {
    console.log(data);
});