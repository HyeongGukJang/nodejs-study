// sunday04ex07_socket_server.js

var io = require('socket.io')(3000);

io.sockets.on('connection', function(socket) {
    socket.emit('news', {'hello':'world'});
    
    socket.on('my other event', function(data) {
        console.log(data);
    });
});