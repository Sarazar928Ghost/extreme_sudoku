const extreme_sudoku = require('./extreme_sudoku');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const size = 3;
let arraySudoku;
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/getArraySudoku', function(req, res) {
    arraySudoku = extreme_sudoku(size).resolved;
    res.json(JSON.stringify({arraySudoku, size}));
});

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
