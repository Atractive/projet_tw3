const assert = require('assert');
const express = require('express');
// const https = require('https');
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const app = express();


var jsondb = require("./data.json");
var dataDB = new Datastore({ filename: 'data.db', autoload: true, corruptAlertThreshold: 1 });


dataDB.insert(jsondb, function (err) {
	console.log("")
})


app.get('/checkout', function (req, res) {
    
    dataDB.find({}, function (err, docs) {
        res.send(docs);
    });
    
});



http.createServer(app).listen(443, function () {
	console.log("Server is up and running...");
});

