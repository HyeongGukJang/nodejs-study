// sunday04ex08_chat_server.js
// express와 socket를 함께실행
var http = require('http');
var express = require('express');
var app = express();
var socketio = require('socket.io');

app.set('port', 3000);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버실행중 : %d', app.get('port'));
});

var io = socketio.listen(server);

// 로그인 아이디 매핑(아이디와 소켓을 매핑시킨다.)
// {로그아이디:소켓아이디, 로그인아이디:소켓아이디 ...}
var login_ids = {};

function sendResponse(socket, command, code, message) {
    var statusObj = {command:command, code:code, message:message};
    socket.emit('response', statusObj);
}


io.sockets.on('connection', function(socket) {
    console.log('connectin ...');
    
    socket.on('message', function(data) {
        console.log('message 받음 ...', data);
        //io.sockets.emit('message', data); // 메세지 에코 처리
        socket.emit('message', data);
        if(login_ids[data.recepient]) {
            var socket_id = login_ids[data.recepient];
            io.sockets.connected[socket_id].emit('message', data);
        } else {
            sendResponse(socket, 'login', '404', '받는 아이디 부재중');
        }
    });
    
    socket.on('login', function(login) {
        console.log('로그인 이벤트 처리...', socket.id);
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;
        
        console.log('접속자 수: %d', Object.keys(login_ids).length);
        sendResponse(socket, 'login', '200', '로그인 되었습니다.');
    });
});