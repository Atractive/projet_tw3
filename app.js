var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
const Datastore = require('nedb');

let geojson = require('./data_full.json');
// let geojson = require('./data.json');

var db = new Datastore({ filename: 'data.db', autoload: true, corruptAlertThreshold: 1 });

// console.log(geojson.features.length);
// for (var i = 0; i < geojson.features.length; i++) {
//     db.insert(geojson.features[i]);
// }

app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    db.find({}, function (err, docs) {
        response.send(geojson);
    });
});


app.get('/geojson', function (request, response) {
    db.find({}, function (err, docs) {
        response.send({ type: "FeatureCollection", features: docs });
    });
});


app.get('/allreal', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.realisateur" : 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++){
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.realisateur);
        }
        response.send({nbreal : s.size, real : Array.from(s)});
    });
});


app.get('/alltitre', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.titre" : 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++){
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.titre);
        }
        response.send({nbreal : s.size, real : Array.from(s)});
    });
});

// orga arroundissement

app.get('/allorga', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.organisme_demandeur" : 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++){
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.organisme_demandeur);
        }
        response.send({nbreal : s.size, real : Array.from(s)});
    });
});

app.get('/allardt', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.ardt" : 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++){
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.ardt);
        }
        response.send({nbreal : s.size, real : Array.from(s)});
    });
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