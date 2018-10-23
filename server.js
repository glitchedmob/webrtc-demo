const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const PORT = 8000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(PORT, function(){
    console.log(`listening on http://localhost:${PORT}`);
});

io.on('connection', socket => {
    socket.on('startCall', data => {
        console.log('startCall');
        socket.broadcast.emit('callStarted', data)
    });

    socket.on('answerCall', data => {
        console.log('answerCall');
        socket.broadcast.emit('callAnswered', data)
    });
});

