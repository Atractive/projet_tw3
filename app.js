var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
const Datastore = require('nedb');

// let geojson = require('./data_full.json');
let geojson = require('./data.json');

var db = new Datastore({ filename: 'data.db', autoload: true, corruptAlertThreshold: 1 });

// for (var i = 0; i < geojson.length; i++){
//     db.insert(geojson[i]);
// }

app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    db.find({}, function (err, docs) {
        response.send(geojson);
    });

});


// app.get('/geojson', function (request, response) {
//     console.log("in geojson")
//     response.send(geojson);
// });

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'map.html'));
});

app.get('/stats', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'stats.html'));
});

http.createServer(app).listen(444, function () {
    console.log("Server is up and running...");
});