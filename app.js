// durée moyenne d'un tournage (différence entre la date_debut et la date_fin)

var express = require('express');
var app = express();
const http = require('http');
var path = require('path');
const Datastore = require('nedb');
const bodyParser = require('body-parser');


// let geojson = require('./data_full.json');
// let geojson = require('./data.json');

// var db = new Datastore({ filename: 'smalldata.db', autoload: true, corruptAlertThreshold: 1 });
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

// nombre de tournage par realisateur
app.get('/tournagesparreal', function (req, res) {

    // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)); 

    var m = {};
    db.find({}, { "properties.realisateur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.realisateur] == 'undefined') {
                m[docs[i].properties.realisateur] = 1;
            } else {
                m[docs[i].properties.realisateur] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// nombre de tournage par arrondissement
app.get('/tournagesparardt', function (req, res) {

    // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)); 

    var m = {};
    db.find({}, { "properties.ardt": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.ardt] == 'undefined') {
                m[docs[i].properties.ardt] = 1;
            } else {
                m[docs[i].properties.ardt] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// nombre de tournage par Organisme demandeur
app.get('/tournagesparorga', function (req, res) {

    var m = {};
    db.find({}, { "properties.organisme_demandeur": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.organisme_demandeur] == 'undefined') {
                m[docs[i].properties.organisme_demandeur] = 1;
            } else {
                m[docs[i].properties.organisme_demandeur] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// Nombre de chaque type de tournage
app.get('/tournagespartype', function (req, res) {

    var m = {};
    db.find({}, { "properties.type_de_tournage": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (typeof m[docs[i].properties.type_de_tournage] == 'undefined') {
                m[docs[i].properties.type_de_tournage] = 1;
            } else {
                m[docs[i].properties.type_de_tournage] += 1;
            }
        }

        res.send({ result: m, taille: Object.keys(m).length });
    });
});

// nombre de tournage EN COURS par Mois
app.get('/tournagesparmois', function (req, res) {

    var m = {};
    // fill m
    for (var i = 0; i < 12; i++) {
        m[i] = 0;
    }
    console.log(m);

    db.find({}, { "properties.date_debut": 1, "properties.date_fin": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(parseInt(m[docs[i].properties.date_debut].split("-")[1]));
            var mois_debut = docs[i].properties.date_debut.split("-")[1];
            var mois_fin = docs[i].properties.date_fin.split("-")[1];
            if (typeof date_debut != undefined && typeof date_fin != undefined) {
                mois_debut = parseInt(mois_debut);
                mois_fin = parseInt(mois_fin);
                // console.log(mois_fin, mois_debut, mois_fin - mois_debut);
                if (mois_fin - mois_debut == 0) {
                    m[mois_debut - 1] += 1;
                } else {
                    for (var j = mois_debut; j < mois_fin - mois_debut; j++) {
                        m[j - 1] += 1;
                    }
                }
            }

        }
        res.send({ result: m });
    });
});

// nombre de film par realisateurs
app.get('/filmparreal', function (req, res) {
    var m = {};
    db.find({}, { "properties.realisateur": 1, "properties.titre": 1 }, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            // console.log(docs[i].properties.titre);
            if (typeof m[docs[i].properties.realisateur] == 'undefined') {
                m[docs[i].properties.realisateur] = new Set();
                m[docs[i].properties.realisateur].add(docs[i].properties.titre);
            } else {
                m[docs[i].properties.realisateur].add(docs[i].properties.titre);
            }
        }
        for (const key in m) {
            m[key] = Array.from(m[key]);
        }
        res.send({ result: m });
    });
});



//////////////////////////////////////////////////////////////////////

app.post('/userInput', function (req, res) {
    var temp = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                parseFloat(req.body.y).toFixed(14),
                parseFloat(req.body.x).toFixed(14)
            ]
        },
        "properties": {
            "type_de_tournage": "",
            "organisme_demandeur": "",
            "adresse": "",
            "date_fin": "",
            "realisateur": "",
            "xy": [
                parseFloat(req.body.x).toFixed(14),
                parseFloat(req.body.y).toFixed(14)
            ],
            "ardt": "",
            "titre": "",
            "date_debut": "",
            "id": req.body.id
        },
    };

    db.insert(temp, function (err, newDoc) {
        if (err) res.send({ status: -1, message: 'Error has occured' });
        else {
            res.send({ status: 0, message: "Document created pour l'id " + req.body.id, data: temp });
        }
    });
});

app.post('/modifmarqueur', function (req, res) {
    var temp = {
        "properties.type_de_tournage": req.body.type_de_tournage,
        "properties.organisme_demandeur": req.body.organisme_demandeur,
        "properties.adresse": req.body.adresse,
        "properties.realisateur": req.body.realisateur,
        "properties.ardt": req.body.ardt,
        "properties.titre": req.body.titre,
        "properties.date_fin": req.body.date_fin,
        "properties.date_debut": req.body.date_fin
    }

    db.update({ "properties.id": req.body.id }, { $set: temp }, {}, function (err, num) {
        if (err) res.send({ status: -1, message: 'unknown question id' });
        else {
            console.log("nombre d'enregistrement dans la base MODIFIER : ", num);
            res.send({ status: 0, message: "Document updated pour l'id " + req.body.id, data: temp });
        }
    })

});


app.post('/removemarqueur', function (req, res) {
    // console.log(req.body.id, parseInt(req.body.id, 10));
    db.remove({ "properties.id": parseInt(req.body.id, 10) }, {}, function (err, num) {
        if (err) res.send({ status: -1, message: 'unknown question id' });
        else {
            // console.log("nombre d'enregistrement dans la base RETIRE : ", num);
            res.send({ status: 0, message: "Document removed pour l'id " + req.body.id });
        }
    });
});

app.post('/loadFields', function (req, res) {
    // console.log(req.body.id, typeof req.body.id);
    res.send({ status: 0 });
});


app.post('/loadFields', function (req, res) {
    // console.log(req.body.id, typeof req.body.id);
    res.send({ status: 0 });
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