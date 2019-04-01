var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
let geojson = require('./data_full.json');
// let geojson = require('./data.json');


app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    console.log("in geojson")
    response.send(geojson);
});

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'map.html'));
});

app.get('/stats', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'stats.html'));
});

http.createServer(app).listen(444, function () {
    console.log("Server is up and running...");
});