const express = require('express');
const http = require('http');

const PORT = 8000;

const app = express();
const server = http.Server(app);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(PORT, function(){
    console.log(`listening on http://localhost:${PORT}`);
});
