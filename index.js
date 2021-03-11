const extreme_sudoku = require('./extreme_sudoku');
const app = require('express')();
const tab = extreme_sudoku();

app.get('/', function(req, res) {
    res.sendFile('index.html');
  });

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });

console.log(tab);
