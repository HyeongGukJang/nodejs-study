// sunday04ex06_socketio.js
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const socketio = require('socket.io');

app.use(cors());

app.use('/', router);
const server = http.createServer(app);
server.listen(3000, ()=>{
    console.log('http://localhost:3000');
});

const io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
    console.log('connection ...');
    
    socket.on('message', function(data) {
        console.log('message 받음 ...', data);
        
        socket.emit('message', data);
    });
});



