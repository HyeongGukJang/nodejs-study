// mongojs 모듈 불러오기
// 초창기 node.js에서 활용하던 방식

const mongojs = require('mongojs');
const db = mongojs("vehicel",["car"]);
db.car.find(function(err,data){
    console.log(data);
});