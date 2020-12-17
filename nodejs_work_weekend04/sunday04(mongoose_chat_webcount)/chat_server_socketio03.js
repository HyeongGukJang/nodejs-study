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



// 로그인 아이디 매핑
// 연결된 로그인 id로 socket을 찾는다.
// {id:socket, id:socket, id:socket ...}
var login_ids = {};

// socketio 객체 생성및 socket 서버 시작
var io = socketio.listen(server);
//var io = socketio.attach(server);

function sendResponse(socket, command, code, message) {
    var statusObj = {
        command: command,
        code: code,
        message: message
    };
    socket.emit('response', statusObj);
}

// 이벤트 처리
io.sockets.on('connection', function(socket) {
    console.log('>>>>>>>>> 소켓 연결 성공!');
    //console.log('connection info: ', socket.request.connection._peername);
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socket.on('message', function(message) {
        console.log('메세지 이벤트 받았다.');
        console.dir(message);
        
        if(message.recepient == 'All') {
            console.dir('현재 접속 세션을 포함한 모든 클라이언트에게 메세지 전달.');
            io.sockets.emit('message', message);
        } else {
            // 메세지 수신 사용자 id 찾기
            if(login_ids[message.recepient]) {
                var socket_id = login_ids[message.recepient];
                io.sockets.connected[socket_id].emit('message', message);
                
                sendResponse(socket, 'message','200', '메시지 전송완료!');
            } else {
                sendResponse(socket, 'login', '404', '상대방 로그인 아이디가 존재하지 않습니다.');
            }
        }
    });
    
    socket.on('login', function(login) {
        console.log('login 이벤트를 받았습니다.');
        console.dir(login);
        
        // 기존 클라이언트 id가 없다면 클라이언트 id를 맵에 추가.
        console.log('속속한 소켓의 id: ', socket.id);
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;
        
        console.log('접속한 클라이언트 id 개수: %d', Object.keys(login_ids).length);
        
        // 메세지 처리 함수 별도 선언.
        sendResponse(socket, 'login', '200', '로그인 됨!');
    });
});


