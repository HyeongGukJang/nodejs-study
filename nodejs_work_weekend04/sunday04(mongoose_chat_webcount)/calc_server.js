// calc_server.js
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors');

//크로스 도메인 문제 해결 - cors()
app.use(cors());

// 더하기 기능
router.route('/plus/:a/:b').get(function(req, res) {
    res.end(String(Number(req.params.a) + Number(req.params.b)))
});
// 빼기 기능
router.route('/minus/:a/:b').get(function(req, res) {
    res.end(String(Number(req.params.a) - Number(req.params.b)))
});
// 곱하기 기능
router.route('/mult/:a/:b').get(function(req, res) {
    res.end(String(Number(req.params.a) * Number(req.params.b)))
});
// 나누기 기능
router.route('/div/:a/:b').get(function(req, res) {
    res.end(String(Number(req.params.a) / Number(req.params.b)))
});

app.use('/', router);
var server = http.createServer(app);
server.listen(3000, function() {
    console.log('http://localhost:3000 ...');
});