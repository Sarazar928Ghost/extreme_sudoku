const extreme_sudoku = require('./extreme_sudoku');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const size = 3;
let tab;
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/getTab', function(req, res) {
    tab = extreme_sudoku().resolved;
    res.json(JSON.stringify({tab, size}));
});

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
