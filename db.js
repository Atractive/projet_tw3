let myData = require('./data.json');
// console.log(myData[0]);


var Datastore = require('nedb')
  , db = new Datastore();


db.insert(myData, function (err) {
  console.log("database loaded");
})

db.find({ "fields.type_de_tournage": "TELEFILM" }, function (err, docs) {
  console.log(docs.length);
});




// var result;
// db.find({}, function(err, docs) {
//   result = docs[0];
// });




  // insert 
  // select 
  // delete
  // update
