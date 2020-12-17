// chat_server_socketio.js
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
var cors = require('cors');

var static = require('serve-static');
var socketio = require('socket.io');
var path = require('path');

//크로스 도메인 문제 해결 - cors()
app.use(cors());
app.use('/public', static(path.join(__dirname, 'public')) );

app.use('/', router);
var server = http.createServer(app);
server.listen(3000, function() {
    console.log('http://localhost:3000 ...');
});

// socketio 객체 생성및 socket 서버 시작
var io = socketio.listen(server);
//var io = socketio.attach(server);

// 이벤트 처리
io.sockets.on('connection', function(socket) {
    console.log('>>>>>>>>> 소켓 연결 성공!');
    //console.log('connection info: ', socket.request.connection._peername);
    //console.log('remote address: ', socket.request.connection._peername.address);
    //console.log('remote port: ', socket.request.connection._peername.port);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
});


