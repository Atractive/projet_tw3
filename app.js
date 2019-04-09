var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
const Datastore = require('nedb');
const bodyParser = require('body-parser');


let geojson = require('./data_full.json');
// let geojson = require('./data.json');

var db = new Datastore({ filename: 'data.db', autoload: true, corruptAlertThreshold: 1 });

// console.log(geojson.features.length);
// for (var i = 0; i < geojson.features.length; i++) {
//     db.insert(geojson.features[i]);
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

app.get('/geojson', function (request, response) {
    db.find({}, function (err, docs) {
        response.send({ type: "FeatureCollection", features: docs });
    });
});

//////////////////////////////////////////////////////////////////////

app.get('/alltitre', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.titre": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.titre);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

app.get('/allreal', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.realisateur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.realisateur);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

app.get('/allorga', function (request, response) {
    var s = new Set();
    db.find({}, { "properties.organisme_demandeur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.realisateur);
            s.add(docs[i].properties.organisme_demandeur);
        }
        response.send({ nb: s.size, info: Array.from(s) });
    });
});

app.get('/nombredeligne', function (req, res) {
    db.find({}, function (err, docs) {
        res.send({ nb: docs.length });
    });

});

//////////////////////////////////////////////////////////////////////

app.post('/userInput', function (req, res) {
    console.log(req.body);
    var temp = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                parseFloat(req.body.y).toFixed(2),
                parseFloat(req.body.x).toFixed(2)
            ]
        },
        "properties": {
            "type_de_tournage": "",
            "organisme_demandeur": "",
            "adresse": "",
            "date_fin": "",
            "realisateur": "",
            "xy": [
                parseFloat(req.body.x).toFixed(2),
                parseFloat(req.body.y).toFixed(2)
            ],
            "ardt": "",
            "titre": "",
            "date_debut": "",
            "id": req.body.id
        },
    };

    db.insert(temp, function (err, newDoc) {
        console.log(newDoc)
    });
    res.send({ ok: true });
});

//////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'map.html'));
});

app.get('/stats', function (request, response) {
    response.sendFile(path.join(__dirname, './', 'stats.html'));
});

http.createServer(app).listen(444, function () {
    console.log("Server is up and running...");
});