var http = require('http');
var server = http.createServer();
var fs = require('fs');

var port = 3000;
server.listen(port, function() {
    console.log('서버가 시작 되었습니다. %d', port);
});

server.on('request', function(req, res) {
    console.log('클라이언트 요청이 들어왔습니다.');
    
    var filename = 'house.jpg';
    var infile = fs.createReadStream(filename, {flags:'r'});
    
    // 파이프로 연결하여 알아서 처리하도록 설정
    infile.pipe(res);
}) ;

server.on('connection', function(req, res) {
    console.log('서버와 연결 되었습니다.');
}) ;

server.on('close', function() {
    console.log('서버가 닫힙니다.');
}) ;