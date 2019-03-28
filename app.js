var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
let geojson = require('./data.json');


app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    console.log("in geojson")
    response.send(geojson);
});

app.get('/clusterexample', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'clusterexample.html'));
});

app.get('/index', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'index.html'));
});

app.get('/indexP', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'indexP.html'));
});

http.createServer(app).listen(444, function () {
    console.log("Server is up and running...");
});



// app.get('/', function (request, response) {
//     response.sendfile('./index.html');
// });
