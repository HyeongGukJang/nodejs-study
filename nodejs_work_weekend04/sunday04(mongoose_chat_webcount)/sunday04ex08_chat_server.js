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

io.sockets.on('connection', function(socket) {
    console.log('connectin ...');
    
    socket.on('message', function(data) {
        console.log('message 받음 ...', data);
        
        io.sockets.emit('message', data); // 메세지 에코 처리
    });
});